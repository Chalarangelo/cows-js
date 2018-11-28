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
const socketServer = new WebSocket.Server({ server });

// Handle WebSockets events
socketServer.on('connection', (socket, request) => {
  // Handle new connections
  console.log(chalk.cyan(`Established connection with client on the following IP address: ${request.connection.remoteAddress}.`));
  socket.send(`Hello there, I am the server!`);

  // Handle received messages
  socket.on('message', message => {
    socketServer.clients.forEach(client => {
      client.send(`${usernameHandler.findUsername(request.connection.remoteAddress)}: ${message}`);
    });
  });
});

// Start the server on the specified port
server.listen(argv.port, () => {
  console.log(chalk.green(`Server started.`));
  console.log(chalk.green(`Listening on port ${argv.port}...`));
});

