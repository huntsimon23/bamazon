var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 8000,
    user: "root",
    password: process.env.DBpassword,
    database: "bamazonDB",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection to bamazonDB successful on port: " + connection.port);
});

