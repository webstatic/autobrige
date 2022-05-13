/// <reference path="lib/jquery-3.6.0.js" />

$(function () {
    var host = window.location.hostname;
    var port = window.location.port
    var protocol = 'wss:';
    var url = protocol + '//' + host + ":" + port;
    console.log('url:', url);
    wsClient = new NwWsClient(url);

    wsClient.setOnConnectEventListener(function (socket) {
        var id = wsClient.getId();
        console.log('onConnect ' + id);

        // wsClient.callService('getServerDateTime', null, function (result) {
        //     console.log(result);
        // })
    });

    wsClient.setOnDisconnectEventListener(function myfunction() {

    });

})