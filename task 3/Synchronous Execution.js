//Log Three Messages in Order
console.log("Start");
console.log("Middle");
console.log("End");

//Function Calls Another Function
function secondFunction() {
    console.log("Step 3: Inside secondFunction");
}

function firstFunction() {
    console.log("Step 2: Inside firstFunction");
    secondFunction();
    console.log("Step 4: Back to firstFunction");
}

console.log("Step 1: Start Program");
firstFunction();
console.log("Step 5: End Program");

//Sequential Calculations
let num1 = 20;
let num2 = 10;

let sum = num1 + num2;
console.log("Sum =", sum);

let difference = num1 - num2;
console.log("Difference =", difference);

let product = num1 * num2;
console.log("Product =", product);

let quotient = num1 / num2;
console.log("Quotient =", quotient);

//Function Depends on Another Function
function calculateSquare(number) {
    return number * number;
}

function printSquare(number) {
    let result = calculateSquare(number);
    console.log("Square =", result);
}

printSquare(6);
