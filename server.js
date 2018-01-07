var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoConnect = require('./mongo_connect.js');
var port = process.env.PORT || 3000;

mongoConnect.connectToServer( function( err ) {
    if (err)
        console.log("error connecting database");
    else {
        app.get('/', function(req, res){
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("Server running !! \n");
            console.log("ahahwhhhaha");
        });

        io.on('connection', function (socket) {
            console.log('user ' + socket.id + ' connected');
            require('./games_state')(socket, io);
            require('./account')(socket);
        });

        http.listen(port, function () {
            console.log('listening on port :'+port);
        });

        setInterval(function() {
            console.log('refresh');
        	app.get("http://srbattle.herokuapp.com");
        }, 300000);

    }
});


