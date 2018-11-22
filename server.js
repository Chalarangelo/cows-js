// Import node dependencies
const http = require('http');
const process = require('process');
// Import external dependencies
const express = require('express');
const WebSocket = require('ws');
const chalk = require('chalk');
// Command-line argument setup
const argv = require('yargs')
  .option('port', {
    alias: 'p',
    describe: 'The port that the application will run on.',
    default: 5000,
    number: 'number'
  })
  .option('cleanup', {
    alias: 'c',
    describe: 'Cleanup all data files after the server finishes running.',
    default: true,
    type: 'boolean'
  })
  .argv;

// Handle exit events appropriately
const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'];
const exitHandler = (eventType) => (err) => {
  if (argv.cleanup)  {
    console.log(chalk.yellow('Cleaning up data files...'));
  }
  if (eventType === 'uncaughtException')  {
    console.log(chalk.red('Exiting due to an uncaughtException...'));
    console.log(chalk.red(err));
    process.exit(1);
  }
  else {
    console.log(chalk.yellow('Exiting normally or due to user termination...'));
    process.exit(0);
  }
}
exitEvents.forEach(event => {
  process.on(event, exitHandler(event));
});

// Handle command-line input
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', function (line) {
  if(line.trim() === 'exit') process.exit(0);
});

// Create the express app, serve the contents of the `public` folder
let app = express();
app.use(express.static('public'));

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
      client.send(`${request.connection.remoteAddress}: ${message}`);
    });
  });
});

// Start the server on the specified port
server.listen(argv.port, () => {
  console.log(chalk.green(`Server started.`));
  console.log(chalk.green(`Listening on port ${argv.port}...`));
});

