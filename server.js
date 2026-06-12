const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

const DB_FILE = "db.json";

// Read Database
function readData() {
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
}

// Write Database
function writeData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* CREATE */
app.post("/students", (req, res) => {
    const db = readData();

    const student = {
        id: Date.now(),
        name: req.body.name,
        age: req.body.age,
        course: req.body.course
    };

    db.students.push(student);
    writeData(db);

    res.status(201).json(student);
});

/* READ ALL */
app.get("/students", (req, res) => {
    const db = readData();
    res.json(db.students);
});

/* READ ONE */
app.get("/students/:id", (req, res) => {
    const db = readData();

    const student = db.students.find(
        s => s.id == req.params.id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(student);
});

/* UPDATE */
app.put("/students/:id", (req, res) => {
    const db = readData();

    const index = db.students.findIndex(
        s => s.id == req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    db.students[index] = {
        ...db.students[index],
        ...req.body
    };

    writeData(db);

    res.json(db.students[index]);
});

/* DELETE */
app.delete("/students/:id", (req, res) => {
    const db = readData();

    db.students = db.students.filter(
        s => s.id != req.params.id
    );

    writeData(db);

    res.json({
        message: "Student deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});