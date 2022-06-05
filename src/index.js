const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  if(!request.headers.username){

    return response.status(401).json('username not informed!');
  }
  next();
}

app.post('/users', (request, response) => {
  const {user, username} = request.body;

  if(!(user && username)){

    return response.status(401).json({Error: 'user or username not defined!'})
  }

  users.push({
    id: uuidv4(),
    user,
    username,
    todos:[]
  })

  return response.status(201).json({Success: 'user created successfully!'})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  console.log(username)
  const user = users.find(users => users.username === username);

  return response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;