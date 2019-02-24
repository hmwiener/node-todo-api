
require('./config/config');

var {mongoose} = require('./db/mongoose');
var {Todos} = require('./model/todos');
var {Users} = require('./model/users');
var {authenticate} = require('./middleware/authenticate');
const {ObjectID} = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var app = express();
app.use(bodyParser.json());
const port = process.env.PORT;

app.post('/todos', authenticate, (req, res) => {
  var todos = new Todos({
    text: req.body.text,
    _creator: req.user._id
  });

  todos.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todos.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    errMsg = 'Object ID is not in a valid format'
    return res.status(400).send(errMsg);
  } else {
    Todos.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
      if (todo) {
        res.status(200).send({todo});
      } else {
        return res.status(404).send();
      }
    });
  }
});

// app.delete('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//
//   if (!ObjectID.isValid(id)) {
//     errMsg = 'Object ID is not in a valid format'
//     return res.status(400).send(errMsg);
//   }
//
//   Todos.findOneAndRemove({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.status(200).send({todo});
//
//     }).catch((err) => {
//     return res.status(404).send();
//   });
//
// });

app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todos.findOneAndRemove({_id: id, _creator: req.user._id});
    if (!todo) {
      return res.status(404).send();
    } else {
      res.send({todo});
    }

  } catch (err) {
    return res.status(400).send();
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    errMsg = 'Object ID is not in a valid format'
    return res.status(400).send(errMsg);
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todos.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});

  }).catch((err) => {
    res.status(400).send();
  });
});

app.post('/users', async (req, res) => {

  try {
    const body = _.pick(req.body, ['userEmail', 'password']);
    const user = new Users(body);

    await user.save();
    if (!user) {
      throw new Error('Couldn\'t save user');
    }
    const token = await user.generateAuthToken();
    if (!token) {
      throw new Error('Couldn\'t generate token');
    }
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['userEmail', 'password']);
    const user = await Users.findByCredentials(body.userEmail, body.password)
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send('User not found or password incorrect');
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
