var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Server running !! \n");
    console.log("ahahwhhhaha");
});

io.configure(function () {
	io.set('transports', ['xhr-polling']);
	io.set('polling duration', 10);
});

io.on('connection', function (socket) {
    console.log('user ' + socket.id + ' connected');
    require('./games_state')(socket, io);
    require('./account')(socket);
});

http.listen(port, function () {
    console.log('listening on port :'+port);
});

