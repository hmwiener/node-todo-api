debugger;

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo server');
  }
  console.log('Connected successfully');

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //     console.log('Unable to fetch docs');
  // });

  // db.collection('Todos').find({
  //     _id: new ObjectID('5c66e581445e7dd81b70c697')}).toArray().then((docs) => {
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 4));
  // }, (err) => {
  //     console.log('Unable to fetch docs');
  // });

  // db.close();


    db.collection('Users').find({name: 'Howard'}).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
      console.log('Something fucked up');
    });
});
