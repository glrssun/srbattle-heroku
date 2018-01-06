var gen = require('./wordgenerator.js');
//var moduleConnection = require('./mysqlconnect');
//var moduleConnection = require('./pgconnect');
var mongoConnect = require('./mongo_connect.js');
var mongodb = mongoConnect.getDb();

var queue = [];
var rooms = {};
var host = [];

var col = mongodb.collection('game_material');

module.exports = function (socket, io) {
    socket.on('request game', function (data) {
        col.aggregate([{$sample: { size: 1 }}]).toArray(function (err, res) {
            if(!err){
                var grid = gen.createGrid(11, [res[0].answer1, res[0].answer2, res[0].answer3]);
                socket.emit('game material', {
                    game_board : grid,
                    sentence : res[0].sentence,
                    question1 : res[0].question1,
                    answer1 : res[0].answer1,
                    question2 : res[0].question2,
                    answer2 : res[0].answer2,
                    question3 : res[0].question3,
                    answer3 : res[0].answer3,
                    WPM : data.WPM
                });
            }else {
                console.log("Error : "+err);
            }
        });
    });

    function findOpponent(socket) {
        var peer;
        if (queue.length > 0) {
            if ((peer = find(queue, "WPM", socket.WPM)) && (socket.id !== peer.id)) {
                queue.splice(queue.indexOf(peer.id), 1);
                var room = socket.id + '#' + peer.id;

                peer.join(room);
                socket.join(room);
                rooms[peer.id] = room;
                rooms[socket.id] = room;

                //foundmatch
                //peer.emit('found match', names[socket.id]);
                //socket.emit('found match', names[peer.id]);
                col.aggregate([{$sample: { size: 1 }}]).toArray(function (err, res) {
                    if(!err){
                        console.log('Answer number one = '+res[0].answer1);
                        var grid = gen.createGrid(11, [res[0].answer1, res[0].answer2, res[0].answer3]);
                        io.in(room).emit('found match', {
                            game_board: grid,
                            sentence: res[0].sentence,
                            question1: res[0].question1,
                            answer1: res[0].answer1,
                            question2: res[0].question2,
                            answer2: res[0].answer2,
                            question3: res[0].question3,
                            answer3: res[0].answer3,
                            WPM: socket.WPM,
                            player: [socket.username, peer.username]
                        });
                    }else {
                        console.log("Error : "+err);
                    }
                });

            } else {
                queue.push(socket);
            }
        } else {
            queue.push(socket);
        }
    }

    socket.on('match making', function (data) {
        console.log('user '+socket.id+' want a match '+data.WPM);
        socket.WPM = data.WPM;
        socket.userid = data.userid;
        socket.username = data.username;

        findOpponent(socket);
        //socket.on('disconnect', function () {
         //   console.log('user '+socket.id+' canceled match');
         //   queue.splice(queue.indexOf(socket.id),1);

        //});
    });

    socket.on('create host', function (data) {
       socket.WPM = data.WPM;
       socket.userid = data.userid;
       socket.username =data.username;

       var hostcode = generateCode();
       while (host.includes(hostcode)){
           hostcode = generateCode();
       }
       socket.host = hostcode;
       host.push(socket);
       console.log('Host '+hostcode+' created');
       socket.emit('host code', hostcode);
    });

    socket.on('join host', function (data) {
        socket.userid = data.userid;
        socket.username = data.username;
        var peer;
        console.log('find host '+data.host);
        if (host.length > 0) {
            if ((peer = find(host, 'host', data.host)) && (socket.id !== peer.id)) {
                host.splice(host.indexOf(peer.host), 1);
                var room = socket.id + '#' + peer.id;
                peer.join(room);
                socket.join(room);
                rooms[peer.id] = room;
                rooms[socket.id] = room;
                console.log(room);
                col.aggregate([{$sample: { size: 1 }}]).toArray(function (err, res) {
                    if (!err) {
                        console.log('Answer number one = ' + res[0].answer1);
                        var grid = gen.createGrid(11, [res[0].answer1, res[0].answer2, res[0].answer3]);
                        io.in(room).emit('found match', {
                            game_board: grid,
                            sentence: res[0].sentence,
                            question1: res[0].question1,
                            answer1: res[0].answer1,
                            question2: res[0].question2,
                            answer2: res[0].answer2,
                            question3: res[0].question3,
                            answer3: res[0].answer3,
                            WPM: peer.WPM,
                            player: [socket.username, peer.username]
                        });
                    } else {
                        console.log("Error : " + err);
                    }
                });
            } else {
                socket.emit('host result', 'not found');
            }
        } else {
            socket.emit('host result', 'not found');
        }
    });

    socket.on('client ready', function () {
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
            setTimeout(function(){ io.in(roomId).emit('games continue', data) }, 2000);
        }
    });

    socket.on('player answer', function (data) {
        console.log('someone answer');
        var room = rooms[socket.id];
        socket.broadcast.to(room).emit('enemy answer', {pos1 : data.pos1, pos2 : data.pos2});
    });

    socket.on('player searching', function (data) {
        console.log('someone searching'+data.pos1);
        var room = rooms[socket.id];
        socket.broadcast.to(room).emit('enemy searching', {pos1 : data.pos1, pos2 : data.pos2});
    });

    socket.on('disconnect', function () {
        roomId = rooms[socket.id];
        console.log('user disconected');
        console.log('user '+socket.id+' canceled match');
        console.log('delete host '+socket.host);
        host.splice(host.indexOf(socket.host),1);
        console.log('delete queue '+socket.id);
        queue.splice(queue.indexOf(socket.id),1);
        socket.leave(roomId);
    });

    //socket.on('game finished', function(){
    //    roomId = rooms[socket.id];
    //    socket.leave(roomId);
    //    socket.disconnect();
    //});

    function find(arr, propName, propValue) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] === propValue)
                return arr[i];
    }

    function generateCode() {
        var text = "";
        var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += code.charAt(Math.floor(Math.random() * code.length));

        return text;
    }
};