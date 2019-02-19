const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pw = 'abc654';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(pw, salt, (err, hash) => {
//     console.log(pw, hash);
//   })
// })

var hashPw = '$2a$10$AkWTqDP8xF3ISD5dJZ8Ekevdk31Y/9ca818VWXpVpUC5zMIwIvgtS';

bcrypt.compare(pw, hashPw, (err, res) => {
  console.log(res);
});

// var data = {
//   id: 16
// };
//
// var token = jwt.sign(data, 'HMW1234');
// console.log(token);
//
// var decoded = jwt.verify(token, 'HMW1234')
// console.log(decoded);

// const {SHA256} = require('crypto-js');
//
// // var message = 'I am user number 3';
// // var hash = SHA256(message).toString();
// // console.log(`Message: ${message}`);
// // console.log(`Hash: ${hash}`);
// //
// // var data = {
// //   id: 4
// // };
// //
// // var token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// // }
// //   Messing with the token causes error below
// // // token.data.id = 5;
// // // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //
// // var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// //
// // if (resultHash === token.hash) {
// // console.log('Data OK');
// // } else {
// //   console.log('Data fucked with');
// // };
