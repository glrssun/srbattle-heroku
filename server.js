var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Server running !! \n");
});

io.on('connection', function (socket) {
    console.log('user ' + socket.id + ' connected');
    require('./games_state')(socket, io);
    require('./account')(socket);
});

http.listen(port, address, function () {
    console.log('listening on ip: '+address+' and port :'+port);
});