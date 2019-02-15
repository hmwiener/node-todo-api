debugger;

const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo server');
  }
  console.log('Connected successfully');

  db.collection('Users').findOneAndUpdate(
    {name: 'Ralph'},
    {$set: {name: 'Howard'}, $inc: {age: 1}
    }, {
      returnOriginal: false
    }
    ).then((result) => {
      console.log(result);
    });

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5c66f203445e7dd81b70c991')
  // }, {
  //     $set: {
  //       completed: true
  //     }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  //Delete Many
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  //Delete One
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  //Find one and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Howard'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').findOneAndDelete({_id: new ObjectID("5c66f49f445e7dd81b70cac1")})
  //   .then((result) => {
  //     console.log(result);
  //   });
});
