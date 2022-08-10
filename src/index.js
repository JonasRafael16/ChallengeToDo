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

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {title, deadline} = request.body;
  const user = users.find(users => users.username === username);

  if (!user) {
    return response.status(401).json({Error: 'username not found!'});
  }

  user.todos.push({
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })


  return response.status(201).json(user.todos);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const user = users.find(users => users.username === username);

  return response.json(user.todos)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
const { username } = request.headers;
const { title, deadline } = request.body;
const { id: idTodo } = request.query;

const user = users.find(users=> users.username === username);
if (!user) {
  return response.status(401).json({Error: 'username not found!'});
}
const todo = user.todos.find(todos => todos.id ===  idTodo);
if (!todo) {
  return response.status(401).json({Error: 'todo not found!'});
}

todo.title = title;
todo.deadline = deadline;

return response.status(201).send()

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id: idTodo } = request.query;

  const user = users.find(users => users.username === username);
  if(!user) {
    return response.status(401).json({Error: 'username not found!'});
  }

  const todo = user.todos.find(todos => todos.id ===  idTodo);
  if (!todo) {
    return response.status(401).json({Error: 'todo not found!'});
  }
  todo.done = true;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;