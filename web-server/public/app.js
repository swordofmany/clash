var conf = {
    gameServerHost: ":3000",
    gameCanvasSelector: ".game-canvas",
    gameConsoleSelector: ".game-console"
}

var app = (function (conf, $, io, moment, createjs) {

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

            app.writeToGameConsole("Connected !", "You are on team \"" + msg.team + "\"");   
            
            var color = msg.team == "blue" ? "blue" : "red";
            
            
            
            //******************** game logic ********************
            var gameCanvasDomElement = $(conf.gameCanvasSelector).get(0);
            var stage = new createjs.Stage(gameCanvasDomElement);

            var rect = new createjs.Shape();
            rect.graphics.beginFill(color).drawRect(0, 0, 50, 50);
            rect.x = 100;
            rect.y = 100;
            stage.addChild(rect);



            createjs.Ticker.addEventListener("tick", handleTick);
            
            function handleTick() {
                //Circle will move 10 units to the right.
                rect.x += 10;
                //Will cause the circle to wrap back
                if (rect.x > stage.canvas.width) { rect.x = 0; }
                stage.update();
            }
            
            
            //***************** END - game logic *****************
            
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

        gameConsoleElement.prepend(msg);
    }



    app.onLoad();
    return app;

} (conf, jQuery, io, moment, createjs));
