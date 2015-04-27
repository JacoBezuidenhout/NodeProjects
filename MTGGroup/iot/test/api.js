var should = require("should");
var request = require('supertest');
var app = require('../app.js');
var skel = require('../helpers/skeleton.json');
var user1 = request.agent('http://localhost');



describe('testing api', function() {

   it('should return {login:true,...}', function(done) {
     user1
       .post('/login')
       .send({ username: skel.user.email, password: skel.user.password })
       .end(function(err, res) {
         // user1 will manage its own cookies
         // res.redirects contains an Array of redirects
         console.log(err);
         done(err);
       });
   });

   it('should return {success:true,...}', function(done) {
     user1
       .post("/api")
       .send(skel.gateways2)
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
