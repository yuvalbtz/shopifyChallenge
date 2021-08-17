const {ApolloServer} = require("apollo-server")
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")
const {db} = require('./util/mysqlConnector')
const { ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) => ({req}),
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
    
})


const PORT = process.env.PORT || 4000

db.connect((err) => {
    if(err) throw err;
    server.listen({port:PORT}, () => console.log(`server is running on port ${PORT}`))    
})












