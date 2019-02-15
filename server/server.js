var {mongoose} = require('./db/mongoose');
var {Todos} = require('./model/todos');
var {Users} = require('./model/users');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todos = new Todos({
    text: req.body.text
  });
  
  todos.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

});
app.listen(3000, () => {
  console.log('Started on port 3000');
});
