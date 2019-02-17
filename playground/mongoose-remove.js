const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todos} = require('./../server/model/todos');
const {Users} = require('./../server/model/users');

//remove all
// Todos.remove({}).then((result) => {
//   console.log(result);
// });

//find one via query
// // Todos.findOneAndRemove({_id: ''}).then((todo) => {
//   console.log(todo);
// });


//find one by id
// Todos.findByIdAndRemove('5c68596334434542b0b119ec').then((todo) => {
//   console.log(todo);
// });
