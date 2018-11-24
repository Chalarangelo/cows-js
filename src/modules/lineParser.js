const readline = require('readline');

// Handle command-line input
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function (line) {
  if (line.trim() === 'exit') process.exit(0);
});

module.exports = rl;