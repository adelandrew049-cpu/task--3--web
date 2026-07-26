//data/students.js
const students = [];

module.exports = students;
//modules/addStudent.js
const students = require("../data/students");

function addStudent(name, grades) {

    students.push({
        name,
        grades
    });

}

module.exports = addStudent;
//modules/calculateAverage.js
function calculateAverage(grades) {

    let sum = 0;

    grades.forEach(grade => {
        sum += grade;
    });

    return sum / grades.length;

}

module.exports = calculateAverage;
//modules/filterPassed.js
const students = require("../data/students");
const calculateAverage = require("./calculateAverage");

function filterPassed() {

    return students.filter(student => {
        return calculateAverage(student.grades) >= 60;
    });

}

module.exports = filterPassed;
//modules/listStudents.js
const students = require("../data/students");
const calculateAverage = require("./calculateAverage");

function listStudents() {

    students.forEach(student => {

        console.log(
            `${student.name} -> Average: ${calculateAverage(student.grades)}`
        );

    });

}

module.exports = listStudents;
//index.js

const addStudent = require("./modules/addStudent");
const listStudents = require("./modules/listStudents");
const filterPassed = require("./modules/filterPassed");

addStudent("Andrew", [80, 70, 90]);
addStudent("Ali", [50, 40, 60]);
addStudent("Sara", [95, 90, 100]);

console.log("All Students");

listStudents();

console.log("\nPassed Students");

console.log(filterPassed());
