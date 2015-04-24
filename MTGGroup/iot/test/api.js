var should = require("should");
var request = require('supertest');
var app = require('../app.js');

describe('testing api', function() {

   it('should return {success:true,...}', function(done) {
     request(app)
       .get(/api);
       .expect(200)
       .end(function(err, res){
          if(err) {
            done(err);
          } else {
            done();
          }
       });
   });


  // it('should return {success:true,...}', function(done) {
  //   request(app)
  //     .post('/api/submitForm')
  //     .send(post_data)
  //     .expect('Content-Type', 'application/json')
  //     .expect(200)
  //     .end(function(err, res){
  //       if(err) {
  //         done(err);
  //       } else {
  //         if (res.body.success)
  //           done();
  //         else
  //           throw res.err;
  //       }
  //     });
  // });

});
