debugger;

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo server');
  }
  console.log('Connected successfully');
});

  // db.collection('Todos').insertOne({
  //   test: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     console.log('Unable to insert Todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 4));
  // });

//   db.collection('Users').insertOne({
//     name: 'Howard',
//     age: 63,
//     location: 'New York'
//   }, (err, result) => {
//     if (err) {
//       console.log('Unable to insert Todo', err);
//     }
//     console.log(result.ops[0]._id.getTimestamp());
//   });
//
//   db.close();
// });
