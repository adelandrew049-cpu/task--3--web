//readBooks.js
const fs = require("fs");
const path = require("path");

const booksPath = path.join(__dirname, "../data/books.json");

function readBooks() {
    try {
        const data = fs.readFileSync(booksPath, "utf-8");

        return JSON.parse(data);

    } catch (error) {

        return [];

    }
}

module.exports = readBooks;
//saveBooks.js
const fs = require("fs");
const path = require("path");

const booksPath = path.join(__dirname, "../data/books.json");

function saveBooks(books) {

    fs.writeFileSync(
        booksPath,
        JSON.stringify(books, null, 2)
    );

}

module.exports = saveBooks;
//addBook.js
const readBooks = require("./readBooks");
const saveBooks = require("./saveBooks");

function addBook(book) {

    const books = readBooks();

    const newBook = {

        id:
            books.length > 0
                ? books[books.length - 1].id + 1
                : 1,

        title: book.title,

        author: book.author,

        price: book.price,

        available: book.available

    };

    books.push(newBook);

    saveBooks(books);

    return newBook;

}

module.exports = addBook;    
//deleteBook.js
const readBooks = require("./readBooks");
const saveBooks = require("./saveBooks");

function deleteBook(id) {

    const books = readBooks();

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {

        return null;

    }

    const deletedBook = books.splice(index, 1);

    saveBooks(books);

    return deletedBook[0];

}

module.exports = deleteBook;
//index.js
const http = require("http");

const readBooks = require("./modules/readBooks");

const addBook = require("./modules/addBook");

const deleteBook = require("./modules/deleteBook");

const PORT = 3000;

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");

    // ================= GET =================

    if (req.method === "GET" && req.url === "/books") {

        try {

            const books = readBooks();

            res.writeHead(200);

            return res.end(JSON.stringify(books));

        } catch (error) {

            res.writeHead(500);

            return res.end(JSON.stringify({

                error: "File Read Error"

            }));

        }

    }

    // ================= POST =================

    if (req.method === "POST" && req.url === "/books") {

        let body = "";

        req.on("data", chunk => {

            body += chunk;

        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                const newBook = addBook(data);

                res.writeHead(201);

                res.end(JSON.stringify(newBook));

            } catch (error) {

                res.writeHead(400);

                res.end(JSON.stringify({

                    error: "Invalid JSON"

                }));

            }

        });

        return;

    }

    // ================= DELETE =================

    if (req.method === "DELETE") {

        const parts = req.url.split("/");

        if (parts[1] === "books" && parts[2]) {

            const id = Number(parts[2]);

            const deleted = deleteBook(id);

            if (!deleted) {

                res.writeHead(404);

                return res.end(JSON.stringify({

                    error: "Book Not Found"

                }));

            }

            res.writeHead(200);

            return res.end(JSON.stringify(deleted));

        }

    }

    // ================= Invalid Route =================

    res.writeHead(404);

    res.end(JSON.stringify({

        error: "Route Not Found"

    }));

});

server.listen(PORT, () => {

    console.log(`Server Running on Port ${PORT}`);

});
