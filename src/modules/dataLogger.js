
const fs = require('fs');

// Log data to a file
const dataLogger = {
  logData(fileName, data) {
    fs.appendFileSync(fileName, `${JSON.stringify(data)}\n`);
  }
}

module.exports = dataLogger;