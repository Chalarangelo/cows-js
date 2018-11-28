const router = require('express').Router();
const bodyParser = require('body-parser');

const customRouter = (usernameHandler) => {
  router.use(bodyParser.json());

  router.post('/users', (req, res, next) => {
    let username = req.body.username;
    if(usernameHandler.checkUsername(username)) {
      usernameHandler.addUsername(username, req.ip);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({
        username: username
      }));
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(409).send(JSON.stringify({
        username: undefined
      }));
    }
  });
  return router;
}

module.exports = customRouter;