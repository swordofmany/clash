// Setup basic express server
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);

// Can be supplied via env vars
var port = process.env.PORT || 80;

server.listen(port, function () {
  console.log('Web server listening at port %d', port);
});

// Routing public directory
app.use(express.static(__dirname + '/public'));