const gql = require("graphql-tag");


module.exports = gql`

type lineItem{
   id:Float!
   ShopifyOrderNumber:Float!,
   lineItemTitle:String!,
   price:Float!
}

type order{
   id:Float!
   ShopifyOrderNumber:Float!
   CustomerFullName:String!
   OrderDate:String!
   OrderSummaryAmount:Float!
   ItemsSumQuantity:Float!
   lineItems:[lineItem]!
} 



 type Query{
   getOrders:[order]!
   getOrderItems(orderId:Float!):[lineItem]!
 } `


    