//var moduleConnection = require('./mysqlconnect');
//var moduleConnection = require('./pgconnect');

var mongodb = require('./mongo_connect').mongodb;
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
                    var today = new Date();
                    var users = { _id:getNextSequence("user_id"), username: data.username, password: md5(data.password), modified: today  };

                    mongodb.collection("users").insertOne(users, function (err) {
                        if (!err){
                            mongodb.collection("users").find(query).toArray(function (err, res) {
                                if (!err){
                                    console.log(res.username);
                                    socket.emit('register result', {_id : res.userid, username: res.username});
                                } else{
                                    console.log("Error select user: "+err);
                                }
                            });
                        } else{
                            console.log("Error insert : "+err);
                        }
                    });
                }
            } else {
        	    console.log("Error checking "+err);
            }
        });
    });

    socket.on('login', function (data) {
        conn.query("SELECT * FROM users where username='"+data.username+"' AND password = '"+md5(data.password)+"'", function (err, res) {
            if (!err){
                if (res.rows.length !== 0 ){
                    socket.emit('login result', {userId : res.rows[0].userid, username: res.rows[0].username});
                }else {
                    socket.emit('login result', 'failed');
                }
            } else {
                console.log("Error : "+err);
            }
        })
    });

    socket.on('check user', function (data) {
        conn.query("SELECT * FROM users where username='"+data+"'", function (err, res) {
            if (!err) {
                if (res.rows.length !== 0){
                    console.log(socket.id);
                    socket.emit('verify user', 'user verified');
                } else {
                    socket.emit('verify user', 'not exist');
                }
            } else {
                console.log("Error checking "+err);
            }
        });
    })
};
