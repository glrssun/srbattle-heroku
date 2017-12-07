//var moduleConnection = require('./mysqlconnect');
var moduleConnection = require('./pgconnect');

var conn = moduleConnection.connection;
var md5 = require('md5');

module.exports = function (socket) {
    socket.on('register', function (data) {
        conn.query("SELECT * FROM users where username='"+data.username+"'", function (err, res) {
        	if (!err){
                if (res.rows.length !== 0){
                    console.log(socket.id);
                    socket.emit('register result', 'exist');
                }else {
                    var today = new Date();
                    var users = [ data.username, md5(data.password), today ];

                    var sql = 'INSERT INTO users(username, password, modified) VALUES($1, $2, $3)';
                    conn.query(sql,users, function (err) {
                        if (!err){
                            conn.query("SELECT * FROM users where username='"+data.username+"'", function (err, res) {
                                if (!err){
                                    console.log(res.rows[0].username);
                                    socket.emit('register result', {userId : res.rows[0].userid, username: res.rows[0].username});
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
    })
};
