//Packages
const inquirer = require('inquirer');
const mysql = require('mysql');
const chalkPipe = require('chalk-pipe');

inquirer.registerPrompt('chalk-pipe', require('inquirer-chalk-pipe'));

//Connect to mysql
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '34646979',
  database : 'bamazon'
});
//Display all products in database
const displayDB = () =>{
  //query string
  //let query = ;
  //connect with database
  connection.query('SELECT * FROM products', (err, res) =>{
    if(err)  throw  err;
    //for every item in the products table
    for(key in res){
      let item = res[key];
      if(item.stock_quantity > 0){
        console.log(
          chalkPipe('grey')(`${item.item_id}`) + " " +
          chalkPipe('grey')(`${item.product_name}`) + " " +
          chalkPipe('green')(`$${item.price}`)
        );
      }
    }
    buyProduct();
  });
};
//Pick a product to buy
const buyProduct = () =>{
  inquirer.prompt([
    {
      name: 'item_id',
      message: 'Enter id of the product you would you like to purchased:'
    },
    {
      name: 'quantity',
      message: 'how many you would you like to purchased?'
    }
  ]).then(function (answers) {
    //query string
    let query = 'SELECT * FROM products WHERE item_id = ?';

    connection.query(query,[answers.item_id],(err, res) =>{

      if(err) throw err;
      if(res[0].stock_quantity >= answers.quantity){
        //Holdes the update content
        let quantity = res[0].stock_quantity - answers.quantity
        let id = answers.item_id
        let total = totalPurchased(answers.quantity,res[0].price);
        updateProducts(quantity,id,total);

      }
    });
  });
};
//Update dabase after picking a products
const updateProducts = (quantity,id,total) =>{
  let query = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?';
  //let quantity = [{stock_quantity: parseInt(item.stock_quantity)}];
  //let product = [{item_id : item.item_id}];
  connection.query(query,[quantity,id], (err,res) =>{
    if(err) throw err;
    console.log(`Total of your purchases: $${total} \nThank you for your purchased!`);
    connection.end();
  });
};
const totalPurchased = (quantity, price) =>{
  return (quantity * price);
}
displayDB();
