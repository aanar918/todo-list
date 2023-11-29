// const express=require('express');
// const cors=require('cors');
// const cookieParser=require('cookie-parser');
// require('dotenv').config()
// const userRouter=require('./src/routes/UserRoutes');
// const PORT=5000;

// //Connect to database
// require('./src/config/db.js');

// const app=express();
// app.use('/api/user',userRouter)

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());

// app.get('/',(req,res)=>{
// res.send('Server created successfully!');
// })

// app.listen(PORT,console.log(`Server running on Port: ${PORT}`));
// index.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todo-graphql', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Todo schema
const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    addTodo(task: String!): Todo
    toggleTodo(id: ID!): Todo
  }
`;

// In-memory Todo data
let todos = [];

// Define resolvers
const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    addTodo: (_, { task }) => {
      const newTodo = { id: String(todos.length + 1), task, completed: false };
      todos.push(newTodo);
      return newTodo;
    },
    toggleTodo: (_, { id }) => {
      const todoIndex = todos.findIndex(todo => todo.id === id);
      if (todoIndex !== -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        return todos[todoIndex];
      }
      return null;
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Apply Apollo middleware to Express
server.applyMiddleware({ app });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
});
