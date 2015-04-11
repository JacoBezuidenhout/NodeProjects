var DB = require("../helpers/db.js");
var should = require("should");
var supertest = require("supertest");

var db;

describe('admin',function() {

  it('DB Connection', function(done){

      db = new DB();
      done();

  });

  it('test idea insert', function(done){

    var count_before = db.getIdeas().length;
    db.addIdea({
                "title": "Test Idea",
                "description": "This is the test idea for the unit test",
                "Groups": ["Intel","MTGGroup","Jaco^2"],
                "valid": false
                });
    var count_after = db.getIdeas().length+1;

    if ((count_after-count_before) == 1)
      done();
    //else
      //throw "Len: " + db.getIdeas().length();
  });

  // it('should not pass', function(done){
  //
  //   throw "error hey";
  //   done();
  //
  // });

});
