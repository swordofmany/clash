// Setup basic express server
var os      = require("os");
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

// Can be supplied via env vars
var port = process.env.PORT || 3000;
var hostname = process.env.HOSTNAME || os.hostname();

server.listen(port, hostname, function () {
  console.log('Server listening at %s port %d', hostname, port);
});

// Routing public directory
app.use(express.static(__dirname + '/public'));

// Counting players
var redTeamCount = 0; // Left side
var blueTeamCount = 0; // Right side

io.on('connection', function (socket) {
	var team;

	// when the client emits 'new message', this listens and executes
	socket.on('hello', function (data) {
		if (redTeamCount > blueTeamCount) { // More reds?
			++blueTeamCount;
			team = "blue";
		} else { // more blues
			++redTeamCount;
			team = "red";
		}
		console.log('Player join the %s team', team);

		// we tell the client on which side he/she is on
		socket.emit('welcome', {
			team: team
		});
	});

	// when the user disconnects
	socket.on('disconnect', function () {
		if (team == "red") {
			--redTeamCount;
		} else {
			--blueTeamCount;
		}

		// echo globally that this client has left
		socket.broadcast.emit('playerLeft', {
			numOfPlayers: redTeamCount + blueTeamCount
		});
	});
});