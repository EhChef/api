const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log('Server listening on port : ', port);

const io = require('socket.io').listen(server);
const socket = require('./api/middleware/socket');

socket.listen(io);