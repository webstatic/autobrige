const express = require('express')
const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 80

const app = express();
app.use(express.static(path.join(__dirname, 'public')))

var appServer = http.createServer(app);
// passiveConn(appServer);

//appServer.listen(commandPort, '0.0.0.0');
appServer.listen(PORT);