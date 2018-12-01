const process = require('process');
const fs = require('fs');
const chalk = require('chalk');

// Delete a non-empty folder
const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// Handle exit events appropriately
const exitHandler = (argv) => {
  const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'];
  const handleExit = (eventType) => (err) => {
    if (argv.cleanup) {
      deleteFolderRecursive('./data');
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