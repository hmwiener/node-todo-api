// const expect = require('expect');
// const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

// const {app} = require('./../server');
const {Todos} = require('./../../model/todos');
const {Users} = require('./../../model/users');


const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  completed: true,
  completedAt: 3456
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}, {
  _id: new ObjectID(),
  text: 'Third test todo'} ];

const populateTodos = (done) => {
    Todos.remove({}).then(() => {
      Todos.insertMany(todos);
    }).then(() => done());
  };

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  userEmail: 'HMWW@email.com',
  password: 'u1Password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'hmw98765').toString()
  }]
  }, {
    _id: userTwoId,
    userEmail: 'someone@somewhere.com',
    password: 'u2Password'
  }];

  const populateUsers = (done) => {
    Users.remove({})
    .then(() => {
      var userOne = new Users(users[0]).save();
      var userTwo = new Users(users[1]).save();
      return Promise.all([userOne, userTwo])
    }).then(() => done());
  };

module.exports = {todos, populateTodos, users, populateUsers};
