const process = require('process');
const chalk = require('chalk');

// Handle exit events appropriately
const exitHandler = (argv) => {
  const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'];
  const handleExit = (eventType) => (err) => {
    if (argv.cleanup) {
      console.log(chalk.yellow('Cleaning up data files...'));
    }
    if (eventType === 'uncaughtException') {
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
    process.on(event, handleExit(event));
  });
}

module.exports = exitHandler;