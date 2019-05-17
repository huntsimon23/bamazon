var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user: "root",
    password: "Shalom77&",
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

var makePurchase = function(res) {
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "What item_id would you like to purchase?",
    }]).then(function(answer){
        var correct = false;
        for(i=0; i<res.length; i++) {
            if(res.product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to buy?",
                    validate: function(val){
                        if(isNaN(val)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    var inventoryLeft = res[id].stock_quantity-answer.quantity;
                    if(inventoryLeft > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + inventoryLeft + "' WHERE product_name='" + product + "'", function(error, result){
                            if (error) throw error;
                            console.log("Congratulations! You purchased hours of repeptitive entertainment!");
                            displayItems();
                        })
                    } else {
                        console.log("We don't have that game. Try again...");
                        makePurchase(res);
                    }
                }).catch(function(err) {
                    if (err) throw err;
                });
            }
        }
    }).catch(function(err){
        if (err) throw err;
    });
};