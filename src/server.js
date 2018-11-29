// Import node dependencies
const http = require('http');
const process = require('process');
const path = require('path');
// Import external dependencies
const express = require('express');
const WebSocket = require('ws');
const chalk = require('chalk');
// Command-line argument setup
const argv = require('./modules/args').argv;
// Handle command-line input
const lineParser = require('./modules/lineParser');
// Handle exit events appropriately
const exitHandler = require('./modules/exitHandler')(argv);
// Handle usernames
const usernameHandler = require('./modules/usernameHandler');
const router = require('./modules/router')(usernameHandler);

// Create the express app, serve the contents of the `public` folder
let app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use('/', router);

// Create the HTTP and WebSockets server
const server = http.createServer(app);
const socketServer = new WebSocket.Server({ 
  server: server,
  clientTracking: true
});

// Handle WebSockets events
socketServer.on('connection', (socket, request) => {
  // Handle new connections
  console.log(chalk.cyan(`Established connection with client on the following IP address: ${request.connection.remoteAddress}`));
  socket.send(`Hello there, I am the server!`);
  socket.isAlive = true;
  socket.ip = request.connection.remoteAddress;

  // Handle received messages
  socket.on('message', message => {
    socketServer.clients.forEach(client => {
      client.send(`${usernameHandler.findUsername(request.connection.remoteAddress)}: ${message}`);
    });
  });

  // Send pings every 10 seconds, terminate clients that are not alive
  setInterval(() => {
    socketServer.clients.forEach(client => {
      if(!client.isAlive) {
        console.log(chalk.cyan(`Terminating connection with client on the following IP address: ${client.ip} - Cannot reach client at this time.`));
        usernameHandler.removeUsername(usernameHandler.findUsername(client.ip));
        return client.terminate();
      } 
      client.isAlive = false;
      client.ping(null, false, true);
    });
  }, 1000);
  // Handle pongs
  socket.on('pong', () => { socket.isAlive = true; });

  // Handle closing the connection
  socket.on('close', (code, reason) => {
    console.log(chalk.cyan(`Terminating connection with client on the following IP address: ${socket.ip} -${reason}(${code})`));
    usernameHandler.removeUsername(usernameHandler.findUsername(socket.ip));
    socket.terminate();
  });

});

// Start the server on the specified port
server.listen(argv.port, () => {
  console.log(chalk.green(`Server started.`));
  console.log(chalk.green(`Listening on port ${argv.port}...`));
});

