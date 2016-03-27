var conf = {
    gameServerHost: ":3000",
    gameConsoleSelector: ".gameConsole"
}

var app = (function (conf, $, io, moment) {

    var app = {}; //declare module
    
    //members
    var gameConsoleElement = $(conf.gameConsoleSelector);
    var socket;
    
    //methods
    app.onLoad = function onLoad() {
        app.writeToGameConsole("Loading Client ...");
    }

    app.run = function run() {
        app.connect(conf.gameServerHost);
    };

    app.connect = function connect(gameServerHost) {

        socket = io(gameServerHost); //connect to server
        app.writeToGameConsole("Connection to game server...");

        //request to join
        socket.emit('hello');
            
        //on joining
        socket.on('welcome', function (msg) {
            console.log("welcome: ", msg);
            app.writeToGameConsole("Connected !", "You are on team \"" + msg.team + "\"");
        });

        socket.on('disconnect', function () {
            app.writeToGameConsole("Disconnect !");
            alert("disconnect");
        });

        socket.on("connect_error", function () {
            socket.disconnect();
            var errMsg = "Unavilable to connect to game server";
            console.error(errMsg);

            app.writeToGameConsole(errMsg);
        });

    }

    app.writeToGameConsole = function writeToGameConsole() {

        var args = Array.prototype.slice.call(arguments);
        args.unshift(moment().format()); //add timestamp
                
        var msg = "<div>" + args.join(" | ") + "</div>";

        gameConsoleElement.append(msg);
    }



    app.onLoad();
    return app;

} (conf, jQuery, io, moment));
