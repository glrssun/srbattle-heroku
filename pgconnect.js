var pg = require('pg');

var conString = process.env.ELEPHANTSQL_URL || "postgres://postgres:5432@localhost/srbattle";

var connection = new pg.Client(conString);

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});

exports.connection = connection;
