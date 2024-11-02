const express = require("express");
const mongoose = require("mongoose");
const Employees = require("./model/Employees");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
app.use(bodyParser.json());
//mongoDB connection
mongoose
  .connect("mongodb://localhost:27017/youtube")
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch(err => {
    console.log("Error connecting to Mongodb:", err);
  });

//sample get api
app.get("/", (req, res) => {
  res.send("hello");
});

//addEmployee
app.post("/addemployee", (req, res) => {
  const newEmployee = new Employees();
  newEmployee.name = req.body.name;
  newEmployee.age = req.body.age;
  newEmployee.email = req.body.email;
  newEmployee
    .save()
    .then(empObj => {
      res.send({
        status: true,
        message: "Employee created successfully",
        data: empObj,
      });
    })
    .catch(err => {
      res.send({ status: false, message: "Request failed", erroe: err });
    });
});

//get Employees
app.get("/employees", (req, res) => {
  Employees.find()
    .then(empObj => {
      res.send({
        status: true,
        message: "Employees fetched successfully",
        data: empObj,
      });
    })
    .catch(err => {
      res.send({ status: false, message: "Request failed", erroe: err });
    });
});

//update Employee
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employees.findById({ _id: id });
    if (!employee) {
      return res.status(404).send({
        status: false,
        message: "Employee not found",
      });
    }
    if (req.body.name) employee.name = req.body.name;
    if (req.body.age) employee.age = req.body.age;
    if (req.body.email) employee.email = req.body.email;

    const upadtedEmployee = await employee.save();
    res.send({
      status: true,
      message: "Upadted employee successfully",
      data: upadtedEmployee,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Request Failed",
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log("running port no:", port);
});
