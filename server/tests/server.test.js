const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todos} = require('./../model/todos');
const {Users} = require('./../model/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST / todos', () => {
  it('should create a new todo', (done) => {
      var text = 'Test todo text';
      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return a todo that matches a legitimate id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should NOT return a todo created by a different user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if no matching todo found', (done) => {
    var badID = new ObjectID;
    request(app)
    .get(`/todos/${badID.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return a 400 if a malformed id is sent', (done) => {
    request(app)
    .get(`/todos/xyz`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(400)
    .end(done);
  });

});

describe('DELETE/todos/:id', () => {
  it('should remove a todo if created by logged-in user', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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

  it('should NOT remove a todo if created by a different user', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todos.findById(hexId).then((todo) => {
        expect(todo).toExist();
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return a 404 if todo not found', (done) => {
    var notFoundID = new ObjectID;
    request(app)
    .delete(`/todos/${notFoundID.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return a 400 if a malformed id number was submitted', (done) => {
    request(app)
    .delete(`/todos/xyz123`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(400)
    .end(done);
  });
});

describe('PATCH/todos/:id', () => {
  it('should update a todo text if created by logged-in user and completed true', (done) => {
    var hexId = todos[0]._id.toHexString();
    var updObj = {text: 'This is the updated text for the todo', completed: true};
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send(updObj)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(updObj.text)
      expect(res.body.todo.completed).toBe(true)
      expect(res.body.todo.completedAt).toBeA('number')
    }).end((err, res) => {
      if (err) {
        return done(err);
      } else {
        return done();
      }
    });
  });

  it('should NOT update a todo created by another user', (done) => {
    var hexId = todos[1]._id.toHexString();
    var updObj = {completed: false};
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send(updObj)
    .expect(404)
    .end((err, res) => {
      if (err) {
        return done(err);
      } else {
        return done();
      }
    });
  });

  it('should clear completedAt when completed false and created by user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var updObj = {completed: false};
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send(updObj)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toBe(null)
    }).end((err, res) => {
      if (err) {
        return done(err);
      } else {
        return done();
      }
    });
  });

});

describe('GET /users/me', () => {
  it('should find a user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.userEmail).toBe(users[0].userEmail);
    })
    .end(done);
  });

  it('should return a 401 if NOT authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var userEmail = 'test@service.com';
    var password = 'HMW1234';

    request(app)
      .post('/users')
      .send({userEmail, password})
      .expect(200)
      .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist;
          expect(res.body.userEmail).toBe(userEmail);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Users.findOne({userEmail}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create a user with invalid data', (done) => {
    var userEmail = 'test2@service';
    var password = 'HMW1234';

    request(app)
      .post('/users')
      .send({userEmail, password})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should not create user if email is already in use', (done) => {
    var userEmail = users[0].userEmail;
    var password = 'HMW1234';

    request(app)
      .post('/users')
      .send({userEmail, password})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('POST /users/login', () => {

  it('should authenticate user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      userEmail: users[1].userEmail,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
        expect(res.headers['x-auth']).toExist();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Users.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((err) => done(err));
    });
  });

  it('should reject users with the wrong email or pw', (done) => {
    request(app)
    .post('/users/login')
    .send({
      userEmail: users[0].userEmail,
      password: 'badPW'
    })
    .expect(400)
    .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Users.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((err) => done(err));
    });
  });
});

describe('DELETE /users/me/token', () => {

  it('should delete a user auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Users.findByCredentials(users[0].userEmail).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => done(err));
    });
  });
});
