var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/srbattle" || process.env.MONGOLAB_URI;

MongoClient.connect(url, function (err, db) {
    if(!err) {
        console.log("Database is connected ... nn");
        mongodb = db;
    } else {
        console.log("Error connecting database ... nn"+err);
    }
});

exports.mongodb = mongodb;
