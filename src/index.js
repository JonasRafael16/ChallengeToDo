const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if(!username){
    return response.status(401).json('username not informed!');
  }

  const user = users.find(users => users.username === username);
  if(!user) {
    return response.status(401).json({Error: 'username not found!'});
  }

  request.user = user;
  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if(!(name && username)){
    return response.status(401).json({error: 'user or username not defined!'})
  }

  const user = users.find(users => users.username === username);
  if(user) {
    return response.status(400).json({error: 'username already exists!'});
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos:[]
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  user.todos.push(todo)

  return response.status(201).json(todo);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  return response.json(user.todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
const { user } = request;
const { title, deadline } = request.body;
const { id: idTodo } = request.params;

const todo = user.todos.find(todos => todos.id ===  idTodo);
  if (!todo) {
    return response.status(404).json({ error: 'todo not found!' });
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(200).json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id: idTodo } = request.params;

  const todo = user.todos.find(todos => todos.id ===  idTodo);
  if (!todo) {
    return response.status(404).json({ error: 'todo not found!' });
  }

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id: idTodo } = request.params;

  const todoIndex = user.todos.findIndex(todos => todos.id ===  idTodo);
  if (todoIndex === -1) {
    return response.status(404).json({ error: 'todo not found!' });
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;