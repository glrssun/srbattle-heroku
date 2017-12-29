var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/srbattle" || "mongodb://glrssun:zxcvbnm@ds133077.mlab.com:33077/srbattle";
;

MongoClient.connect(url, function (err, db) {
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn"+err);
        mongodb = db;
    }
});

exports.mongodb = mongodb;
