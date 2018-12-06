const readline = require('readline');
const chalk = require('chalk');

// Handle command-line input
const lineParser = (usernameHandler) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('line', function (line) {
    let command = line.trim();
    if (command === 'exit') process.exit(0);
    if (command === 'users') 
      console.log(chalk.cyan(`Connected users:\n${usernameHandler.users.map(v => `${v.username}@${v.ip}`).join('\n')}`));
    if (command.startsWith('kick ')){
      let username = command.slice(5).trim();
      if (usernameHandler.removeUsername(username)) console.log(chalk.green(`User '${username}' successfully removed.`));
      else console.log(chalk.yellow(`No user '${username}'.`));
    }
    if (command === 'help'){
      console.log(chalk.cyan(`Available commands:
exit          Terminate the server.
users         Show a list of connected users.
kick <user>   Remove a user from the server.`));
    }
  }); 
  return rl;
}

module.exports = lineParser;