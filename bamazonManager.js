var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user: "root",
    password: process.env.DBpassword,
    database: "bamazonDB",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection to bamazonDB successful");
    console.log("- - - - - - - - - - - - - - - - - ");
    managerStuff();
});

var managerList = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"];

function managerStuff() {
    inquirer.prompt({
        type: "list",
        name:"managerList",
        choices: managerList,
        message: "Hello boss!  What would you like to do?"
    }).then(function(answers) {
        switch (answers){
            case "View Products for Sale":
            productsForSale();
                break;
            case "View Low Inventory":
            lowInventory();
                break;
            case "Add to Inventory":
            addToInventory();
                break;
            case "Add New Product":
            addNewProduct();
                break;
            case "Quit":
            console.log("See you tomorrow boss!");
            process.exit();
                break;
        };
    }).catch(function(error){
        if (error) throw error;
    });
};

function productsForSale() {
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log("Here are the current products for sale at Bamazon:")
        console.log(table);
        managerStuff();
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log("There are 5 or less of these items...consider adding to inventory!");
        console.log(table);
        managerStuff();
    });
};

function addToInventory()