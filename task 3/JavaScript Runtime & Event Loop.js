//Write a program using console.log and setTimeout and predict the output before running it.
console.log("Start");

setTimeout(() => {
    console.log("Timer");
}, 2000);

console.log("End");
//Create a code snippet mixing synchronous logs and setTimeout(0) and explain the execution order.
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

console.log("C");

console.log("D");

//3. Write a program that demonstrates how JavaScript executes line by line despite asynchronous behavior.
console.log("Line 1");

setTimeout(() => {
    console.log("Line 4");
}, 1000);

console.log("Line 2");

console.log("Line 3");
//Write a program that demonstrates how JavaScript executes line by line despite asynchronous behavior.
console.log("Start");

setTimeout(() => {
    console.log("Async Task");
}, 0);

console.log("Processing...");
console.log("Finishing...");
