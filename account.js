//var moduleConnection = require('./mysqlconnect');
//var moduleConnection = require('./pgconnect');

var mongoConnect = require('./mongo_connect.js');
var autoIncrement = require('mongodb-autoincrement');
var mongodb = mongoConnect.getDb();
var md5 = require('md5');


module.exports = function (socket) {
    socket.on('register', function (data) {
        var query = {username: data.username};
        mongodb.collection("users").find(query).toArray(function (err, res) {
        	if (!err){
                if (res.length !== 0){
                    console.log(socket.id);
                    socket.emit('register result', 'exist');
                }else {
                    autoIncrement.getNextSequence(mongodb, "users", function (err, seqRes) {
                        if (!err){
                            var today = new Date();
                            mongodb.collection("users").insert({
                                _id: seqRes,
                                username: data.username,
                                password: md5(data.password),
                                modified: today
                            },function (err) {
                                if (!err){
                                    mongodb.collection("users").find(query).toArray(function (err, res) {
                                        if (!err){
                                            console.log(res[0].username);
                                            socket.emit('register result', {userId : res[0]._id, username: res[0].username});
                                        } else{
                                            console.log("Error select user: "+err);
                                        }
                                    });
                                } else{
                                    console.log("Error insert : "+err);
                                }
                            });
                        } else {
                            console.log("Error sequence");
                        }
                    });
                }
            } else {
        	    console.log("Error checking "+err);
            }
        });
    });

    socket.on('login', function (data) {
        var query = {username: data.username, password: md5(data.password)};
        mongodb.collection("users").find(query).toArray(function (err, res) {
            if (!err){
                if (res.length !== 0 ){
                    socket.emit('login result', {userId : res[0]._id, username: res[0].username});
                }else {
                    socket.emit('login result', 'failed');
                }
            } else {
                console.log("Error : "+err);
            }
        })
    });

    socket.on('check user', function (data) {
        if(data.username !== null){
            var query = {username: data.username};
            mongodb.collection("users").find(query).toArray(function (err, res) {
                if (!err) {
                    console.log(res);
                    if (res.length !== 0){
                        console.log(socket.id);
                        console.log("yes");
                        socket.emit('verify user', 'user verified');
                    } else {
                        console.log("no");
                        socket.emit('verify user', 'not exist');
                    }
                } else {
                    console.log("Error checking "+err);
                }
            });
        }
    })
};
