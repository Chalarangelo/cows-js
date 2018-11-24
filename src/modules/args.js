const yargs = require('yargs');

const options = yargs
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
  });

module.exports = options;