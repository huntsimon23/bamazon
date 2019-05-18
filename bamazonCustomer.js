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
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log(table);
        makePurchase(res);
    });
};

function makePurchase(res) {
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "What item_id would you like to purchase? (Type 'quit' to quit wasting your money).",
        validate: function(q) {
            if (q == "quit") {
                process.exit();
            } else if (isNaN(q)==false) {
                return true;
            } else {
                return false;
            };
        }
    }, {
        type: "input",
        name: "quantity",
        message: "How many would you like to buy?",
        validate: function(val){
            if(isNaN(val)==false){
                return true;
            } else {
                return false;
            };
        },
    }]).then(function(answer){
        for(var i = 0; i < res.length; i++) {
            if(res[i].item_id == answer.choice) {
                var product = res[i].product_name;
                var price = res[i].price;
                var inventoryLeft = res[i].stock_quantity-answer.quantity;
                    if(inventoryLeft > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + inventoryLeft + "' WHERE product_name='" + product + "'", function(error, result){
                            if (error) throw error;
                            console.log("- - - - - - - - - - - - - - - - - ");
                            console.log("- - - - - - - - - - - - - - - - - ");
                            console.log("Congratulations! You purchased hours of repeptitive entertainment with " + answer.quantity + " " + product + "'s, for a grand total of $" + answer.quantity*price + ".  Your items are on their way and should be to you soon!  Care to buy again?");
                            console.log("- - - - - - - - - - - - - - - - - ");
                            console.log("- - - - - - - - - - - - - - - - - ");
                            displayItems();
                        });
                    } else {
                    console.log("- - - - - - - - - - - - - - - - - ");
                    console.log("Bamazon does not have sufficient quantity to fulfill this purchase.  Try again...");
                    console.log("- - - - - - - - - - - - - - - - - ");
                    makePurchase(res);
                    }; 
                }; 
            
        };
        if (parseInt(answer.choice) > res.length || parseInt(answer.choice) <= 0) {
            console.log("- - - - - - - - - - - - - - - - - ");
            console.log("We don't have that game. Try again...");
            console.log("- - - - - - - - - - - - - - - - - ");
            makePurchase(res);
        };
    }).catch(function(err){
        if (err) throw err;
    });
};