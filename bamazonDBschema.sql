create database bamazonDB;

create table products (
item_id integer(10) auto_increment not null,
product_name varchar(30) not null,
department_name varchar(30) not null,
price decimal (6,2) not null,
stock_quantity integer(10) not null,
primary key (item_id)
); 