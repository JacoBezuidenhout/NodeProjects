var should = require("should");
var request = require('supertest');
var app = require('../app.js');

var post_data = {
"title":"Form Title",
"desc":"Form Description",
"fields":
        {
        "Name":"John",
        "Surname":"Peters",
        "ID":"8605135118083",
        "Age":"29",
        "Tel":"+27126587855"
        },
"form_id":"5528d99a6eeb6d21385f42b3"
};

describe('testing api', function() {
  it('should return Content-Type application/json and code 200', function(done) {
    request(app)
      .get('/api/getForms')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res){
        if(err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should return {success:true,...}', function(done) {
    request(app)
      .post('/api/submitForm')
      .send(post_data)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res){
        if(err) {
          done(err);
        } else {
          if (res.body.success)
            done();
          else
            throw res.err;
        }
      });
  });

});
