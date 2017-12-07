var pg = require('pg');

var conString = "postgres://kyamrjbjyajcde:ae6032eec7570b55df6d0853fe05f1d5b525c4c8a779459af40da2bb460a3e40@ec2-46-137-94-97.eu-west-1.compute.amazonaws.com:5432/dch3n74b9gp6o2"  || "postgres://postgres:zxcvbnm@localhost:5432/srbattle";

var connection = new pg.Client(conString);

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn"+err);
    }
});

exports.connection = connection;
