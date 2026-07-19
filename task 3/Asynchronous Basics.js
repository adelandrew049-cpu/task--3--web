//Print "Hello" Immediately and "World" After 2 Seconds
console.log("Hello");

setTimeout(() => {
    console.log("World");
}, 2000);
//Print Numbers from 1 to 5 (One Number Every Second)
for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}
//Show "Loading..." Then "Done" After 3 Seconds
console.log("Loading...");

setTimeout(() => {
    console.log("Done");
}, 3000);
//Simulate a Delayed Message System
console.log("Sending message...");

setTimeout(() => {
    console.log("Message delivered!");
}, 2000);
