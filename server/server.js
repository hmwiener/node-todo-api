var {mongoose} = require('./db/mongoose');
var {Todos} = require('./model/todos');
var {Users} = require('./model/users');
const {ObjectID} = require('mongodb');

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

app.get('/todos', (req, res) => {
  Todos.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    errMsg = 'Object ID is not in a valid format'
    return res.status(400).send(errMsg);
  } else {
    Todos.findById(id).then((todo) => {
      if (todo) {
        res.status(200).send({todo});
      } else {
        return res.status(404).send();
      }
    });
  }
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
