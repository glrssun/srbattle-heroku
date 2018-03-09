var gen = require('./wordgenerator.js');
//var moduleConnection = require('./mysqlconnect');
//var moduleConnection = require('./pgconnect');
var mongoConnect = require('./mongo_connect.js');
var mongodb = mongoConnect.getDb();

var queue = [];
var activeRooms = {};
var host = [];
var onQueue = { "200" : 0, "230" : 0, "250" : 0, "280" : 0, "300" : 0, "350" : 0, "400" : 0, "500" : 0,};


var col = mongodb.collection('game_material');

/// ----------------- MATCH MAKING /// ---------------------------------

module.exports = function (socket, io) {
    socket.on('player on queue', function () {
        socket.emit('on queue', onQueue);
    });

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

    socket.on('match making', function (data) {
        console.log('user '+socket.id+' want a match '+data.WPM);
        socket.WPM = data.WPM;
        socket.userid = data.userid;
        socket.username = data.username;
        countQueue('plush', data.WPM, onQueue);

        io.emit('on queue', onQueue);

        findOpponent(socket);
    });

    function countQueue(operation, prop, JSONObj) {
        if (JSONObj.has(prop)){
            if (operation === 'plush'){
                JSONObj.prop++;
            } else if (operation === 'minus'){
                JSONObj.prop--;
            }
        }
    }

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
        if (host.length > 0) {
            if ((peer = find(host, 'host', data.host)) && (socket.id !== peer.id)) {
                host.splice(host.indexOf(peer.host), 1);
                var room = socket.id + '#' + peer.id;
                peer.join(room);
                socket.join(room);
                activeRooms[peer.id] = room;
                activeRooms[socket.id] = room;
                col.aggregate([{$sample: { size: 1 }}]).toArray(function (err, res) {
                    if (!err) {
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
                console.log('kode tidak cocok');
                socket.emit('host result', 'not found');
            }
        } else {
            console.log('host list kosong');
            socket.emit('host result', 'not found');
        }
    });

    socket.on('match success', function (){
        if(onQueue !== 0)onQueue--;
        io.emit('on queue', onQueue);
    });

    socket.on('cancel match', function () {
        queue = queue.filter(function (item) {
            return item.id !== socket.id;
        });
        if(onQueue !== 0)onQueue--;
        io.emit('on queue', onQueue);
    });

    socket.on('cancel host', function () {
        host = host.filter(function (item) {
            return item.host !== socket.host;
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
                activeRooms[peer.id] = room;
                activeRooms[socket.id] = room;

                col.aggregate([{$sample: { size: 1 }}]).toArray(function (err, res) {
                    if(!err){
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

    ///////////////////// ------------------------------ GAME STATES -----------------///////////////////

    socket.on('client ready', function () {
        var nClient = 0;
        var readyClients = 0;
        var roomId = activeRooms[socket.id];
        var room = io.sockets.adapter.rooms[roomId];
        socket.ready = 'yes';
        Object.keys(room.sockets).forEach(function (socketId) {
            nClient += 1;
            check = io.sockets.connected[socketId];
            if (check.ready === 'yes'){
                readyClients += 1;
            }
        });;
        if (readyClients === nClient){
            socket.ready = 'no';
            io.in(roomId).emit('game start', '');
        }
    });

    socket.on('sync game', function () {
        var nClient = 0;
        var readyClients = 0;
        var roomId = activeRooms[socket.id];
        var room = io.sockets.adapter.rooms[roomId];
        socket.ready = 'yes';
        Object.keys(room.sockets).forEach(function (socketId) {
            nClient += 1;
            check = io.sockets.connected[socketId];
            if (check.ready === 'yes'){
                readyClients += 1;
            }
        });
        if (readyClients === nClient){
            socket.ready = 'no';
            io.in(roomId).emit('sync', '');
        }
    });

    socket.on('word found', function (data) {
        var nClient = 0;
        var readyClients = 0;
        var roomId = activeRooms[socket.id];
        var room = io.sockets.adapter.rooms[roomId];
        socket.ready = 'yes';
        Object.keys(room.sockets).forEach(function (socketId) {
            nClient += 1;
            check = io.sockets.connected[socketId]; //
            if (check.ready === 'yes'){
                readyClients += 1;
            }
        });
        if (readyClients === nClient){
            socket.ready = 'no';
            setTimeout(function(){ io.in(roomId).emit('games continue', data) }, 2000);
        }
    });

    socket.on('player answer', function (data) {
        var room = activeRooms[socket.id];
        socket.broadcast.to(room).emit('enemy answer', {pos1 : data.pos1, pos2 : data.pos2});
    });

    socket.on('player searching', function (data) {
        var room = activeRooms[socket.id];
        socket.broadcast.to(room).emit('enemy searching', {pos1 : data.pos1, pos2 : data.pos2});
    });

    socket.on('quit game', function () {
        socket.broadcast.to(activeRooms[socket.id]).emit('player quit');
        socket.leave(activeRooms[socket.id]);
    });

    socket.on('game finished', function () {
        socket.leave(activeRooms[socket.id]);
    });

};