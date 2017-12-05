var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

io.on('connection', function (socket) {
    console.log('user ' + socket.id + ' connected');
    require('./games_state')(socket, io);
    require('./account')(socket);
});

app.get('/', function (req, res) {
    res.render('index');
});

http.listen(port, function () {
    console.log('listening on *:'+port);
});