var gen = require('./wordgenerator.js');
//var moduleConnection = require('./mysqlconnect');
var moduleConnection = require('./pgconnect');
var conn = moduleConnection.connection;

var queue = [];
var rooms = {};

module.exports = function (socket, io) {
    socket.on('request game', function (data) {
        conn.query("SELECT * FROM game_material OFFSET floor(random()*(select COUNT(*) from game_material)) LIMIT 1", function (err, res) {
            if(!err){
                console.log('Answer number one = '+res.rows[0].answer1);
                var grid = gen.createGrid(11, [res.rows[0].answer1, res.rows[0].answer2, res.rows[0].answer3]);
                socket.emit('game material', {
                    game_board : grid,
                    sentence : res.rows[0].sentences,
                    question1 : res.rows[0].question1,
                    answer1 : res.rows[0].answer1,
                    question2 : res.rows[0].question2,
                    answer2 : res.rows[0].answer2,
                    question3 : res.rows[0].question3,
                    answer3 : res.rows[0].answer3,
                    WPM : data.WPM
                });
            }else {
                console.log("Error : "+err);
            }
        });
    });

    var findOpponent = function (socket) {
        if (queue.length > 0){
            if ((peer = find(queue, "WPM", socket.WPM)) && (socket.id !== peer.id)){
                queue.splice(queue.indexOf(peer.id),1);
                var room = socket.id + '#' + peer.id;

                peer.join(room);
                socket.join(room);
                rooms[peer.id] = room;
                rooms[socket.id] = room;

                //foundmatch
                //peer.emit('found match', names[socket.id]);
                //socket.emit('found match', names[peer.id]);
                conn.query("SELECT * FROM game_material OFFSET floor(random()*(select COUNT(*) from game_material)) LIMIT 1", function (err, res) {
                    if (!err){
                        console.log('Answer number one = '+res.rows[0].answer1);
                        var grid = gen.createGrid(11, [res.rows[0].answer1, res.rows[0].answer2, res.rows[0].answer3]);
                        io.in(room).emit('found match', {
                            game_board : grid,
                            sentence : res.rows[0].sentences,
                            question1 : res.rows[0].question1,
                            answer1 : res.rows[0].answer1,
                            question2 : res.rows[0].question2,
                            answer2 : res.rows[0].answer2,
                            question3 : res.rows[0].question3,
                            answer3 : res.rows[0].answer3,
                            WPM : socket.WPM,
                            player : [socket.username, peer.username]
                        });
                    } else {
                        console.log("Error : "+err);
                    }
                });
            }else {
                queue.push(socket);
            }
        } else {
            queue.push(socket);
        }
    };

    socket.on('match making', function (data) {
        console.log('user '+socket.id+' want a match '+data.WPM);
        socket.WPM = data.WPM;
        socket.userid = data.userid;
        socket.username = data.username;

        findOpponent(socket);
        socket.on('disconnect', function () {
            console.log('user '+socket.id+' canceled match');
            queue.splice(queue.indexOf(socket.id),1);

        });

    });

    socket.on('client ready', function (data) {
        var readyClients = 0;
        var roomId = rooms[socket.id];
        var room = io.sockets.adapter.rooms[roomId];
        socket.ready = 'yes';
        console.log('socket '+socket.id+' ready');
        Object.keys(room.sockets).forEach(function (socketId) {
            check = io.sockets.connected[socketId]; //
            if (check.ready === 'yes'){
                readyClients += 1;
            }
        });
        console.log('client ready '+readyClients);
        if (readyClients === 2){
            socket.ready = 'no';
            io.in(roomId).emit('game start', '');
        }
    });

    socket.on('word found', function (data) {
        var readyClients = 0;
        var roomId = rooms[socket.id];
        var room = io.sockets.adapter.rooms[roomId];
        console.log('socket '+socket.id+' found the word');
        socket.ready = 'yes';
        Object.keys(room.sockets).forEach(function (socketId) {
            check = io.sockets.connected[socketId]; //
            console.log(check.ready);
            if (check.ready === 'yes'){
                readyClients += 1;
            }
        });
        console.log('client ready '+readyClients);
        if (readyClients === 2){
            console.log('game state is : '+data);
            socket.ready = 'no';
            io.in(roomId).emit('games continue', data);
        }
    });

    socket.on('games session', function (data) {
        var room = rooms[socket.id];
        socket.broadcast.to(room).emit('enemy answer', {pos1 : data.pos1, pos2 : data.pos2});
    });

    socket.on('disconnect', function () {
        console.log('user disconected');
    });

    socket.on('game finished', function(){
        roomId = rooms[socket.id];
        socket.leave(roomId);
        socket.disconnect();
    });

    function find(arr, propName, propValue) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] === propValue)
                return arr[i];
    }
};