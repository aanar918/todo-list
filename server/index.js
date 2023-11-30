const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
require("dotenv").config();
const port = process.env.SERVICE_PORT

// MongoDB connection
const connetionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@m-todo.lzktauj.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(connetionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection
  .on('error', console.error.bind(console, 'MongoDB connection error:'))
  .once('open', () => console.log('Connected to MongoDB'));

// Todo model definition
const Todo = mongoose.model('Todo', {
  text: String,
  completed: Boolean,
  order: Number,
});

// GraphQL schema
const typeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    order: Float!
  }

  input TodoFilter {
    completed: Boolean
  }

  type Query {
    todos: [Todo]
    todo(filter: TodoFilter): [Todo]
    byId(id: ID!): Todo
  }
  
  type Mutation {
    addTodo(text: String!): Todo
    updateTodo(id: ID!, text: String, completed: Boolean, order: Float): Todo
    deleteTodo(id: ID!): Todo
    toggleTodo(id: ID!): Todo
  }
`;

// Graphql resolvers
const resolvers = {
  Query: {
    todos: async () => {
      return await Todo.find().sort({ order: 1 });
    },
    todo: async (_, { filter }) => {
      if (filter && filter.completed !== undefined) {
        return await Todo.find({ completed: filter.completed }).sort({ order: 1 });
      } else {
        return await Todo.find().sort({ order: 1 });
      }
    },
    byId: async (_, { id }) => {
      return await Todo.findById(id);
    },
  },
  Mutation: {
    addTodo: async (_, { text }) => {
      const highestOrderTodo = await Todo.findOne().sort({ order: -1 });
      console.log(highestOrderTodo)
      const order = highestOrderTodo ? highestOrderTodo.order + 1 : 1;
      const todo = new Todo({ text, completed: false, order });
      await todo.save();
      return todo;
    },

    updateTodo: async (_, { id, text, completed, order }) => {
      const todo = await Todo.findById(id);
      if (text !== undefined) todo.text = text;
      if (completed !== undefined) todo.completed = completed;
      if (order !== undefined) {
        await Todo.updateMany({ order: { $gte: order } }, { $inc: { order: 1 } });
        todo.order = order;
      }
      await todo.save();
      return todo;
    },

    deleteTodo: async (_, { id }) => {
      const found = await Todo.findById(id);
      await Todo.updateMany({ order: { $gt: found.order } }, { $inc: { order: -1 } });
      const todo = await Todo.findByIdAndDelete(id);
      return todo;
    },

    toggleTodo: async (_, { id }) => {
      const found = await Todo.findById(id);
      const todo = Todo.updateOne({ id: id, completed: !found.completed })
      return todo
    }
  },
};

const app = express()
const cors = require('cors')
app.use(cors())
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(res => {
  server.applyMiddleware({ app, cors: false });
  app.listen({ port: port }, () =>
    console.log("service started on port:", port)
  )
})
