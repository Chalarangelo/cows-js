// Import node dependencies
const http = require('http');
const process = require('process');
const path = require('path');
const fs = require('fs');
// Import external dependencies
const express = require('express');
const WebSocket = require('ws');
const chalk = require('chalk');
// Command-line argument setup
const argv = require('./modules/args').argv;
// Handle exit events appropriately
const exitHandler = require('./modules/exitHandler')(argv);
// Handle usernames
const usernameHandler = require('./modules/usernameHandler');
const router = require('./modules/router')(usernameHandler);
// Handle command-line input
const lineParser = require('./modules/lineParser')(usernameHandler);
// Handle data logging
const dataLogger = require('./modules/dataLogger');
// Grab message codes
const { MESSAGE_CODES } = require('./config/messageCodes');
const { MESSAGE_DESCRIPTORS } = require('./config/messageDescriptors');

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

  let welcomeMessage = {
    user: usernameHandler.findUsername(request.connection.remoteAddress),
    message: MESSAGE_DESCRIPTORS.welcome,
    timestamp: new Date(),
    messageCode: MESSAGE_CODES.system
  }
  socket.send(JSON.stringify(welcomeMessage));
  socket.isAlive = true;
  socket.ip = request.connection.remoteAddress;

  // Handle received messages
  socket.on('message', message => {
    let user = usernameHandler.findUsername(request.connection.remoteAddress);
    if(user === null) return socket.terminate();
    let data = JSON.parse(message);
    data.messageCode = data.messageCode == MESSAGE_CODES.system && Object.values(MESSAGE_DESCRIPTORS).includes(data.message)
      ? MESSAGE_CODES.system
      : MESSAGE_CODES.message;
    data.timestamp = new Date();
    if (data.messageCode === MESSAGE_CODES.message) {
      dataLogger.logData('./data/messages.data', data);
    }
    if(user !== data.user) {
      console.log(chalk.yellow(`Bogus request from IP: ${request.connection.remoteAddress}`));
    }
    // Broadcast to everyone
    socketServer.clients.forEach(client => {
      client.send(JSON.stringify(data));
    });
  });

  // Send pings every 10 seconds, terminate clients that are not alive
  setInterval(() => {
    socketServer.clients.forEach(client => {
      if(!client.isAlive) {
        console.log(chalk.cyan(`Terminating connection with client on the following IP address: ${client.ip} - Cannot reach client at this time.`));
        let user = usernameHandler.findUsername(socket.ip);
        usernameHandler.removeUsername(user);
        
        client.terminate();

        socketServer.clients.forEach(client => {
          let broadcastData = {
            user: user,
            message: MESSAGE_DESCRIPTORS.terminated,
            timestamp: new Date(),
            messageCode: MESSAGE_CODES.system
          }
          client.send(JSON.stringify(broadcastData));
        });
      } 
      client.isAlive = false;
      client.ping(null, false, true);
    });
  }, 10000);
  // Handle pongs
  socket.on('pong', () => { socket.isAlive = true; });

  // Handle closing the connection
  socket.on('close', (code, reason) => {
    console.log(chalk.cyan(`Terminating connection with client on the following IP address: ${socket.ip} -${reason}(${code})`));
    let user = usernameHandler.findUsername(socket.ip);
    usernameHandler.removeUsername(user);

    socket.terminate();

    socketServer.clients.forEach(client => {
      let broadcastData = {
        user: user,
        message: MESSAGE_DESCRIPTORS.terminated,
        timestamp: new Date(),
        messageCode: MESSAGE_CODES.system
      }
      client.send(JSON.stringify(broadcastData));
    });
  });

});

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Start the server on the specified port
server.listen(argv.port, () => {
  console.log(chalk.green(`Server started.`));
  console.log(chalk.green(`Listening on port ${argv.port}...`));
});

