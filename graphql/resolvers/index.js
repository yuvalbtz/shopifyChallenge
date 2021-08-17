const ordersResolvers = require("./orders")

module.exports = {
   
    Query:{
        ...ordersResolvers.Query
    },   
}



