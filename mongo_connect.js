var MongoClient = require('mongodb').MongoClient;
var url = ENV['MONGODB_URI'] || "mongodb://glrssun:zxcvbnm@ds133077.mlab.com:33077/srbattle";
var mongodb = null;

MongoClient.connect(url, function (err, db) {
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn"+err);
        mongodb = db;
    }
});

exports.mongodb = mongodb;
