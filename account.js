//var moduleConnection = require('./mysqlconnect');
var moduleConnection = require('./pgconnect');

var conn = moduleConnection.connection;
var md5 = require('md5');

module.exports = function (socket) {
    socket.on('register', function (data) {
        conn.query("SELECT * FROM users where username='"+data.username+"'", function (err, res) {
            if (res.length !== 0){
                console.log(socket.id);
                socket.emit('register result', 'exist');
            }else {
                var today = new Date();
                var users = {
                    username: data.username,
                    password: md5(data.password),
                    modified: today };

                var sql = 'INSERT INTO users SET ?';
                conn.query(sql,users, function () {
                    conn.query("SELECT * FROM users where username='"+data.username+"'", function (err, res) {
                        console.log(res[0].username);
                        socket.emit('register result', {userId : res[0].userid, username: res[0].username});
                    });
                });
            }
        });
    });

    socket.on('login', function (data) {
        conn.query("SELECT * FROM users where username='"+data.username+"' AND password = '"+md5(data.password)+"'", function (err, res) {
            if (res.length !== 0 ){
                socket.emit('login result', {userId : res[0].userid, username: res[0].username});
            }else {
                socket.emit('login result', 'failed');
            }
        })
    })
};
