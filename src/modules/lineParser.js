const readline = require('readline');

// Handle command-line input
const lineParser = (usernameHandler) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('line', function (line) {
    let command = line.trim();
    if (command === 'exit') process.exit(0);
    if (command === 'users') console.log(usernameHandler.users);
    // TODO: Format `users` nicely, add `help`, `kick <user>`
  }); 
  return rl;
}

module.exports = lineParser;