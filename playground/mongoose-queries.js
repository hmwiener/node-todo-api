const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todos} = require('./../server/model/todos');
const {Users} = require('./../server/model/users');

// var id = '5c683ac32afc0e880a441dad';
// bad Todo ID for testing
// var id = '6c683ac32afc0e880a441dadxzhsdyh';

// if (!ObjectID.isValid(id)) {
//   console.log('\n\nObject ID invalid\n\n');
// };

// Todos.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
// });
//
// Todos.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos: ', todo);
// });

var id = '5c670f2ccca56b2c207827d0';
//var id = '6c670f2ccca56b2c207827d0000';

Users.find({_id: id})
  .then((user) => {
    if (!user) {
      return console.log('User not found');
    }
    console.log('User: ', user);
  });

  Users.findOne({_id: id})
    .then((user) => {
      if (!user) {
        return console.log('User not found');
      }
      console.log('User: ', user);
    });

Users.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User: ', user);
}).catch((err) => console.log(err));
