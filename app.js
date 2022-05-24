_ = require("underscore");

const express = require('express')
const path = require('path')
const http = require('http');

// nodestatic = require('node-static');
// file = new nodestatic.Server(__dirname + '/web');

NwLib = require('./lib/NwLib.js');
Class = NwLib.Nwjsface.Class;

// nwEspCollection = require('./nwEspCollection.js');
nwHttpConn = require('./nwHttpConn.js');


NwWsServer = require('./NwWsServer.js');
NwServiceProcess = require('./NwServiceProcess.js');
NwServiceMethod = require('./NwServiceMethod.js');

//------------------------------------------------------------------------

// NwWsClient = require('./web/NwWsClient.js');

// // wsClient = new NwWsClient("http://newww.duckdns.org");
// wsClient = new NwWsClient("http://rutapon.totddns.com:37900");

// wsClient.setOnConnectEventListener(function (socket) {
//     var id = wsClient.getId();
//     console.log('onConnect ' + id);

//     wsClient.callService('reg_node', { sid: id, did: id }, function (resultData) {
//         console.log(resultData);
//         // cb(resultData)
//     });

//     // wsClient.callService('getServerDateTime', null, function (result) {
//     //     console.log(result);
//     // })
// });

// wsClient.setOnMessageEventListener(function (socket, msgObj, fn) {
//     // console.log('OnMessage', msgObj, wsClient.getId());
//     NwServiceProcess.cammandProcess(msgObj, function (result) {
//         //console.log(result);

//         fn(result);
//     });
// })

// wsClient.setOnDisconnectEventListener(function myfunction() {
//     console.log('wsClient Disconnect');
// });

//------------------------------------------------------------------------
var port = process.env.PORT || 80
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
        console.log('OnDisconnectEventListener', socket.id);
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

    const app = express();
    app.use(express.static(path.join(__dirname, 'public')))

    var appServer = http.createServer(app);

    // //var httpServer = http.createServer(app);
    // var appServer = http.createServer(function (request, response) {
    //     request.addListener('end', function () {
    //         //
    //         // Serve files!
    //         //
    //         file.serve(request, response);
    //     }).resume();
    // });

    passiveConn(appServer, httpConn, espColl);

    appServer.listen(commandPort);
}

listenCommand(port);

console.log('Start App newww');


var pos = {
    lat: 7.86824670,
    lng: 98.39706840,
}

var infoData = {}
infoData.pos = pos

// var stringify = require('zipson').stringify;
NwServiceProcess.cmdMethod['getInfo'] = function (data, cb) {
    if (cb) {
        infoData.date = new Date()
        cb(infoData)
    }

}

NwServiceProcess.cmdMethod['setInfo'] = function (data, cb) {
    infoData.data = data
    if (cb)
        cb(infoData)
}

let nodeTable = {}
NwServiceProcess.cmdMethod['reg_node'] = function (data, cb) {
    console.log('reg_node');
    console.log(data);
    nodeTable[data.did] = data.sid;
    cb('ok')

    // setTimeout(() => {
    //     wsServer.callService('getInfo', {}, function (result) {
    //         console.log('getInfo', result);
    //     })
    // }, 5000);
}

NwServiceProcess.cmdMethod['call_node'] = function (data, cb) {

    let cmd = data.cmd
    let sid;
    if (data.sid) {
        sid = data.sid;
    }
    else {
        sid = nodeTable[data.did];
    }

    if (sid) {
        // console.log('call_node', sid);
        wsServer.callService(cmd, data.data, function (resultData) {
            cb(resultData)
        }, sid);
    } else {
        cb(null)
    }

}