
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    errMsg = 'Object ID is not in a valid format'
    return res.status(400).send(errMsg);
  }

  Todos.findByIdAndRemove(id).then((todo) => {

    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});

    }).catch((err) => {
    return res.status(404).send();
  });

});

app.patch('/todos/:id', (req, res) => {
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

  Todos.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});

  }).catch((err) => {
    res.status(400).send();
  });
});


app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['userEmail', 'password']);
  var user = new Users(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  })

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['userEmail', 'password']);

  Users.findByCredentials(body.userEmail, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => {
    res.status(400).send('User not found or password incorrect');
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
