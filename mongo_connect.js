var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI;
var mongodb;

MongoClient.connect(url, function (err, db) {
    if(!err) {
        console.log("Database is connected ... nn");
        mongodb = db;
    } else {
        console.log("Error connecting database ... nn"+err);
    }
});

var getDb = function () {
    return mongodb;
};

exports.getDb = getDb;
