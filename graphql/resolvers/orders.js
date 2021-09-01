
const {instance} = require('../../util/axios')
const {db} = require('../../util/mysqlConnector')

module.exports = {
   
    Query:{
        async getOrders(){
           
            const {data} = await instance({ // fetching the orders
                method: 'get',
                url: '/orders.json?status=any',
             }) 



             function ordersTableCreation(){ // create and insert the orders into mySQL 
            let sql = 'CREATE TABLE orders(id INT AUTO_INCREMENT PRIMARY KEY, ShopifyOrderNumber DOUBLE UNIQUE, CustomerFullName VARCHAR(255),OrderDate VARCHAR(255),OrderSummaryAmount DOUBLE,ItemsSumQuantity DOUBLE)'
             db.query(sql, (err, result) => {
                if(result){
                    let insertOrders  = 'INSERT INTO orders SET ?'
                    data.orders.forEach(order => {
                        let orderSQL = {
                            ShopifyOrderNumber:order.order_number, 
                            CustomerFullName:order.billing_address.name, 
                            OrderDate: new Date(order.created_at).toLocaleDateString(), 
                            OrderSummaryAmount:order.total_line_items_price, 
                            ItemsSumQuantity:order.line_items.length 
                        }
                        
                      db.query(insertOrders, orderSQL, (err, res) => {
                            if(err) throw err 
                            //console.log(res);
                        })     
                    })
                    console.log('ordersTableCreation success!!'); 
                }
            })  
          }
          

           function lineItemsTableCreation(){ // create and insert the order lineItems into mySQL 
            let createItemsTableSQL = 'CREATE TABLE lineItems(id INT AUTO_INCREMENT PRIMARY KEY,ShopifyOrderNumber DOUBLE, lineItemTitle VARCHAR(255), price DOUBLE, FOREIGN KEY(ShopifyOrderNumber) REFERENCES orders(ShopifyOrderNumber))'
            db.query(createItemsTableSQL, (err, res) => {
                if(err) throw err 
               if(res){
                   data.orders.forEach(order =>{
                       order.line_items.forEach(item => {
                        
                        let insertItems  = 'INSERT INTO lineItems SET ?'
                       
                        let lineItemsSQL = { 
                            ShopifyOrderNumber:order.order_number,
                            lineItemTitle: item.name, 
                            price:Number(item.price) * item.quantity,
                           }
                       db.query(insertItems, lineItemsSQL, (err, res) => {
                            if(err) throw err 
                          // console.log(res);
                        })     
                       })
                   })
                    
                   console.log('lineItemsTableCreation seccess!!');
               
                }
            })  
        }

        try {
            
           // if the orders TABLE is not Exist we want to create it with the Data from the API 
           let ordersNotExist = 'CREATE TABLE IF NOT EXISTS orders(id INT AUTO_INCREMENT PRIMARY KEY, ShopifyOrderNumber DOUBLE, CustomerFullName VARCHAR(255),OrderDate VARCHAR(255),OrderSummaryAmount DOUBLE,ItemsSumQuantity DOUBLE)';
           db.query(ordersNotExist, (err, res) =>{
               if(res){
                   let deleteOrders = 'DROP TABLE orders'
                   db.query(deleteOrders, (err, result) => { // if the Table Exist we want to recreate it with the updated data on refresh
                   if(result){
                     ordersTableCreation() 
                     console.log('orders table ReCreated!');
                   }
               })  
             }
           })
           
            // if the lineItems TAble is not Exist we want to create it with the updated Data from the API 
              let lineItemsExist = 'CREATE TABLE IF NOT EXISTS lineItems(id INT AUTO_INCREMENT PRIMARY KEY,ShopifyOrderNumber DOUBLE, lineItemTitle VARCHAR(255), price DOUBLE)'
             db.query(lineItemsExist, (err, res) => {
                if(res){
                    console.log(JSON.parse(JSON.stringify(res)));
                    console.log('if not exist');
                    console.log(err);
                    let deleteLineItems = 'DROP TABLE lineItems'
                    db.query(deleteLineItems,(err, result) => {        
                    if(result){
                        lineItemsTableCreation() 
                        console.log('lineItems table ReCreated!');
                       }
                     
                      })
                }
            }) 
               
                
                
                  let selectOrders = new Promise((resolve, reject) =>{
                    let SelectOrders = 'SELECT * FROM orders';
                    db.query(SelectOrders,(err,results) => resolve(Object.values(JSON.parse(JSON.stringify(results)))));
                   
                })
               
             return selectOrders;  
                
                
             } catch (error) {
                 console.log(error);
             }      

        }, 
        
        
        async getOrderItems(_,{orderId}){
           let lineItems = []
            try {
              let selectOrderItems = new Promise((resolve, reject) => {
                let selectLineItemsSQL = `SELECT * FROM lineItems WHERE ShopifyOrderNumber = ${orderId}`
                db.query(selectLineItemsSQL, (err,result) => {
                     if(err) return reject(err); 
                      lineItems = Object.values(JSON.parse(JSON.stringify(result)))
                     return resolve(lineItems)   
                     
                  })
              })
               
              return selectOrderItems;
            
            } catch (error) {
                console.log(error);
            }      

       },  
    }
}
