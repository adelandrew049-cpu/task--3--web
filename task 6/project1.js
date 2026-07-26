//data/products.js
const products = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Phone", price: 500 },
    { id: 3, name: "Mouse", price: 50 },
    { id: 4, name: "Keyboard", price: 80 }
];

module.exports = products;
//data/cart.js
const cart = [];

module.exports = cart;
//modules/addToCart.js
const products = require("../data/products");
const cart = require("../data/cart");

function addToCart(id) {
    const product = products.find(product => product.id === id);

    if (product) {
        cart.push(product);
        console.log(`${product.name} added to cart.`);
    } else {
        console.log("Product not found.");
    }
}

module.exports = addToCart;
//modules/removeFromCart.js
const cart = require("../data/cart");

function removeFromCart(id) {

    const index = cart.findIndex(product => product.id === id);

    if (index !== -1) {
        console.log(`${cart[index].name} removed.`);
        cart.splice(index, 1);
    } else {
        console.log("Product not found in cart.");
    }

}

module.exports = removeFromCart;
//modules/listCart.js
const cart = require("../data/cart");

function listCart() {

    if (cart.length === 0) {
        console.log("Cart is empty.");
        return;
    }

    console.log("Shopping Cart");

    cart.forEach(product => {
        console.log(
            `${product.id} - ${product.name} - $${product.price}`
        );
    });

}

module.exports = listCart;
//modules/calculateTotal.js
const cart = require("../data/cart");

function calculateTotal() {

    let total = 0;

    cart.forEach(product => {
        total += product.price;
    });

    console.log(`Total = $${total}`);

}

module.exports = calculateTotal;
//index.js
const addToCart = require("./modules/addToCart");
const removeFromCart = require("./modules/removeFromCart");
const listCart = require("./modules/listCart");
const calculateTotal = require("./modules/calculateTotal");

addToCart(1);
addToCart(3);
addToCart(2);

listCart();

calculateTotal();

removeFromCart(3);

listCart();

calculateTotal();
