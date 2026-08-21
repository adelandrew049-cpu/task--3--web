# DriveHub Backend

Node/Express/MongoDB (Mongoose) API for the DriveHub Car Rental Management
System. Structured as: config / controllers / middleware / models / routes /
utils, with multer for image uploads and a consistent { status, message,
data } JSON response shape.

## What this module does

This is the authentication and authorization module of the DriveHub
backend. It handles:

- User registration (POST /signup) - creates a customer account, hashes
  the password, and returns a JWT so the account can be used immediately.
- Login (POST /login) - verifies email + password and returns a JWT.
- Password reset via a single-use, time-limited token.
- Role-based access control (RBAC) - every protected route checks the JWT
  (via a `protect` middleware) and, where relevant, the user's role (via a
  `restrictTo(...roles)` middleware) before running the controller.

This auth module is the foundation the rest of the app (Cars, Reservations,
User management) builds on - every protected endpoint in those modules
reuses the same `protect` / `restrictTo` middleware.

## User roles

Three roles, stored on the `User` model's `role` field:

| Role | Description |
|---|---|
| `admin` | Manages all users (activate/suspend, change role, delete), full system access |
| `employee` | Manages the car fleet (add/edit/delete/availability), approves or rejects reservations |
| `customer` | Browses cars, books reservations, manages their own profile |

`POST /signup` always creates a `customer` account. Employee and admin
accounts are created by an existing admin via `POST /users` or promoted via
`PATCH /users/:id` - there's no public signup path directly into a
privileged role, on purpose.

## Setup / running locally

```bash
cd drivehub-backend
npm install
cp .env.example .env   # fill in MONGODB_URI and a JWT_SECRET
npm run dev             # or npm start
```

The server starts on `PORT` (default `5000`). Uploaded images are served
from `/api/v1/uploads/cars/...`, `/api/v1/uploads/profile-pictures/...`,
and `/api/v1/uploads/licenses/...`.

Optionally run `npm run seed` to populate the database with sample
admin/employee/customer accounts, cars, and reservations - useful for
testing the routes below without registering everything by hand.

## Auth routes + examples

All requests/responses below are JSON unless noted. Base URL:
`http://localhost:5000/api/v1/auth`

### POST /signup

Creates a customer account and returns a JWT immediately.

Request:
```json
{
  "fullName": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "Customer@1234",
  "phone": "+20 100 000 0003",
  "city": "Cairo, Egypt"
}
```

Response (201):
```json
{
    "status": "success",
    "message": "Account created successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODQ3MzNmNmJiN2Y3MTZjZjI2OTU2ZSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc4NzA2NTE1MiwiZXhwIjoxNzg3NjY5OTUyfQ._tAjaW_22SVRMFSKnzNhk3YE8Y9zPvwYxZW8fYFhBNI",
    "data": {
        "user": {
            "_id": "6a84733f6bb7f716cf26956e",
            "fullName": "Ahmed Ali",
            "email": "ahmed@example.com",
            "role": "customer",
            "status": "active"
        }
    }
}
```

> `POST /register` is kept as an alias of `/signup` for backward
> compatibility - both call the same controller.

### POST /login

Request:
```json
{
  "email": "ahmed@example.com",
  "password": "Customer@1234"
}
```

Response (200, success):
```json
{
    "status": "success",
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODQ3MzNmNmJiN2Y3MTZjZjI2OTU2ZSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc4NzA2NTkwMiwiZXhwIjoxNzg3NjcwNzAyfQ.UOjS2HFH3MA8ogHKO4UPKE1cR-cq56HUny_ogQN1h-w",
    "data": {
        "user": {
            "_id": "6a84733f6bb7f716cf26956e",
            "fullName": "Ahmed Ali",
            "email": "ahmed@example.com",
            "role": "customer"
        }
    }
}
```

Response (401, wrong credentials):
```json
{
  "status": "fail",
  "message": "Incorrect email or password"
}
```

### POST /logout

No body required. Since JWTs are stateless, this is just a clean
client-facing endpoint - the actual "logout" is the client discarding its
token.

### POST /forgot-password

Request:
```json
{ "email": "ahmed@example.com" }
```

Response (200):
```json
{
  "status": "success",
  "message": "Password reset token generated. Check your email for instructions."
}
```

### PATCH /reset-password/:token

Request:
```json
{ "password": "NewSecurePass456" }
```

Response (200):
```json
{
  "status": "success",
  "message": "Password reset successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Accessing a protected route with the token

Any route behind `protect` (e.g. `GET /api/v1/users/profile`) requires the
header:
```
Authorization: Bearer <token>
```

Response without a token (401):
```json
{
  "status": "fail",
  "message": "You are not logged in. Please log in to get access"
}
```

## Other endpoints (Users / Cars / Reservations)

These build on the auth module above using the same `protect` /
`restrictTo` middleware.

### Users - /api/v1/users (JWT required)
- GET /profile (alias of /me), PATCH /me, POST /me/photo (field
  profilePicture), POST /me/license (field drivingLicense, customer only)
- Admin only: GET /, POST /, GET /:id, PATCH /:id, DELETE /:id

### Cars - /api/v1/cars
- GET /?search=&category=&available= (public), GET /:id (public)
- Employee/Admin: POST / (field images, up to 6), PATCH /:id,
  PATCH /:id/availability, DELETE /:id

### Reservations - /api/v1/reservations (JWT required)
- Customer: POST / ({car, pickupDate, returnDate}), GET / (own only),
  GET /:id (own only), PATCH /:id (own, while pending)
- Employee/Admin: GET / (all), PATCH /:id/approve, PATCH /:id/reject
- Admin only: DELETE /:id
