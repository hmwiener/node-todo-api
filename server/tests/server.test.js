const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todos} = require('./../model/todos');
const {Users} = require('./../model/users');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}, {
  _id: new ObjectID(),
  text: 'Third test todo'} ];

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

describe(' GET /todos/:id', () => {
  it('should return a todo that matches a legitimate id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return a 404 if no matching todo found', (done) => {
    var badID = new ObjectID;
    request(app)
    .get(`/todos/${badID.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return a 400 if a malformed id is sent', (done) => {
    request(app)
    .get(`/todos/xyz`)
    .expect(400)
    .end(done);
  });

});

describe('DELETE/todos/:id', () => {
  it('should delete a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todos.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return a 404 if todo not found', (done) => {
    var notFoundID = new ObjectID;
    request(app)
    .delete(`/todos/${notFoundID.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return a 400 if a malformed id number was submitted', (done) => {
    request(app)
    .delete(`/todos/xyz123`)
    .expect(400)
    .end(done);
  });
});
