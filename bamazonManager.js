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
        switch (answers.managerList){
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
        console.log("- - - - - - - - - - - - - - - - - ");
        console.log(table);
        managerStuff();
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log("There are 5 or less of these items...consider adding to inventory!");
        console.log("- - - - - - - - - - - - - - - - - ");
        console.log(table);
        managerStuff();
    });
};

function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        var table = cTable.getTable(res);
        var products = [];
        console.log("Here are the current inventory levels:");
        console.log("- - - - - - - - - - - - - - - - - ");
        console.log(table);
        for (i = 0; i < res.length; i++) {
            products.push(res[i].product_name);
        };
        inquirer.prompt([{
            type: "list",
            name: "productList",
            message: "WHich product would you like to offer more of?",
            choices: products
        }, {
            type: "input",
            name: "stockQuantity",
            message: "How many would you like to order for restock?",
            validate:  function(val){
                if(isNaN(val)==false){
                    return true;
                } else {
                    return false;
                };
            },
        }]).then(function(ans) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity + '" + ans.stockQuantity + "'WHERE ?", {product_name: ans.productList}, function(err, res) {
            if (err) throw err;
            console.log("- - - - - - - - - - - - - - - - - ");
            console.log("Stock is being shipped! " + ans.stockQuantity + " " + ans.productList + "'s are on the way.");    
            managerStuff();
            });
        }).catch(function(error) {
            if (error) throw error;
        });
    });
};

function addNewProduct() {
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What new product would you like Bamazon to sell?"
      },
      {
        name: "department",
        type: "input",
        message: "What department will it be listed under?"
      },
      {
        name: "price",
        type: "input",
        message: "How much will it be sold for?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many will Bamazon stock?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ]).then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("You have successfully added the following product to Bamazon:" + cTable.getTable(answer));
          managerStuff();
        }
      );
    });
};
