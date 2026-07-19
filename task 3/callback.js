1.// Function Takes a Name and a Callback
function greet(name, callback) {
    console.log("Hello " + name);

    callback();
}

function sayGoodbye() {
    console.log("Have a nice day!");
}

greet("Andrew", sayGoodbye);

//2. Calculator Using Callback
function calculator(num1, num2, operation) {
    let result = operation(num1, num2);
    console.log("Result =", result);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

calculator(10, 5, add);
calculator(10, 5, subtract);
calculator(10, 5, multiply);

//3. Simulate Loading Data
function loadData(callback) {
    console.log("Loading data...");

    setTimeout(() => {
        console.log("Data loaded successfully.");
        callback();
    }, 3000);
}

function showData() {
    console.log("Displaying data...");
}

loadData(showData);

//4. Authentication Flow Using Callbacks
function login(username, password, successCallback) {
    console.log("Checking login...");

    setTimeout(() => {
        if (username === "Andrew" && password === "1234") {
            console.log("Login successful.");
            successCallback();
        } else {
            console.log("Login failed.");
        }
    }, 2000);
}

function goToHomePage() {
    console.log("Welcome to the Home Page!");
}

login("Andrew", "1234", goToHomePage);
