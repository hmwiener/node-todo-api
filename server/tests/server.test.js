const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todos} = require('./../model/todos');
const {Users} = require('./../model/users');

const todos = [{text: 'First test todo'}, {text: 'Second test todo'}, {text: 'Third test todo'} ];

beforeEach((done) => {
  Todos.remove({}).then(() => {
    Todos.insertMany(todos);
  }).then(() => done());
});

describe('POST / todos', () => {
  it('should create a new todo', (done) => {
      var text = 'Test todo text';
      request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todos.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
    });

    it('should not create a todo with bad body data', (done) => {
      request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todos.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((err) => done(err));
      });
    });
});

describe('GET / Todos', () => {
  it('should GET all Todos', (done)=> {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);
  });
});
