//Task 1: Fetch Product Information
const products = {
    1: "Laptop",
    2: "Phone",
    3: "Tablet"
};

function getProduct(id) {
    return new Promise((resolve, reject) => {

        if (products[id]) {
            resolve(products[id]);
        } else {
            reject("Product not found.");
        }

    });
}

getProduct(2)
    .then((product) => {
        console.log(product);
    })
    .catch((error) => {
        console.log(error);
    });
//Task 2: Calculate Shipping Cost
function calculateShipping(weight) {
    return new Promise((resolve, reject) => {

        if (weight > 0) {
            const cost = weight * 5;
            resolve(`Shipping cost: ${cost}`);
        } else {
            reject("Invalid weight");
        }

    });
}

calculateShipping(10)
    .then((cost) => {
        console.log(cost);
    })
    .catch((error) => {
        console.log(error);
    });
//Task 3: Register New User with Email Verification
function sendVerificationEmail(email) {
    return new Promise((resolve, reject) => {

        console.log("Sending verification email...");

        setTimeout(() => {
            resolve("Email sent successfully");
        }, 2000);

    });
}

async function registerUser(name, email) {

    try {

        if (!name || !email) {
            throw "Name or email is missing";
        }

        const message = await sendVerificationEmail(email);

        console.log(message);

        console.log("User registered successfully");

    } catch (error) {

        console.log(error);

    }

}

registerUser("andrew", "andrew@gmail.com");
//Task 4: Fetch User Profile From API
async function getUserProfile(id) {

    try {

        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );

        if (!response.ok) {
            throw new Error("User not found");
        }

        const user = await response.json();

        console.log("Name:", user.name);
        console.log("Email:", user.email);

    } catch (error) {

        console.log(error.message);

    }

}

getUserProfile(1);
