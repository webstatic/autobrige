_ = require("underscore");
async = require("async");

http = require('http');
nodestatic = require('node-static');
file = new nodestatic.Server(__dirname + '/web');

NwLib = require('./lib/NwLib.js');
Class = NwLib.Nwjsface.Class;

// nwEspCollection = require('./nwEspCollection.js');
nwHttpConn = require('./nwHttpConn.js');


NwWsServer = require('./NwWsServer.js');
NwServiceProcess = require('./NwServiceProcess.js');
NwServiceMethod = require('./NwServiceMethod.js');


//------------------------------------------------------------------------
var port = 80
var httpConn = null;
var espColl = null;

var wsServer = null;

var passiveConn = function (appServer, httpConn, espColl) {
    var self = this;

    wsServer = new NwWsServer(appServer);

    NwServiceMethod.addNwWsServer(wsServer, httpConn, espColl);

    NwServiceProcess.addServiceMethod(NwServiceMethod);


    wsServer.setOnConnectEventListener(function (socket) {
        console.log('OnConnectEventListener ' + socket.id);

    });

    wsServer.setOnDisconnectEventListener(function (socket) {
        console.log('OnDisconnectEventListener');
    });


    wsServer.setOnMessageEventListener(function (socket, msgObj, fn) {
        NwServiceProcess.cammandProcess(msgObj, function (result) {
            //console.log(result);

            // console.log(result);
            fn(result);
        });
    });
}


var listenCommand = function (commandPort) {
    this.commandPort = commandPort;

    //var httpServer = http.createServer(app);
    var appServer = http.createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);

        }).resume();
    });


    passiveConn(appServer, httpConn, espColl);


    // setInterval(function () {
    //     var now = new Date();
    //     var h = now.getHours()

    //     if (h < 9 || h >= 12) {
    //         console.log('try set_pin');
    //         httpConn.remoteFunc(clientIp, 'set_pin',
    //             function (body) {
    //                 console.log('D13', 1, body);

    //                 setTimeout(function (params) {
    //                     httpConn.remoteFunc(clientIp, 'set_pin',
    //                         function (body) {
    //                             console.log('D13', 0, body);
    //                         },
    //                         { pin: "D13", val: 0 });

    //                 }, 200)
    //             },
    //             { pin: "D13", val: 1 });
    //     }

    // }, 15000);

    //appServer.listen(commandPort, '0.0.0.0');
    //appServer.listen(54262);

    appServer.listen(commandPort);

}

listenCommand(port);

console.log('Start App newww');
