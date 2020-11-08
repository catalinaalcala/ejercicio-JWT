var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');

/* Create user. */
router.post('/register', async function(req, res, next) {
  const newUser = await createUser(req.body);
  res.send(newUser);
});
/** Login */
router.post('/login', async function(req, res, next) {
    const authUser = await login(req.body);
    if (newUser.success === false) {
      res.send( 403 ).json( {
        success: false,
        message: 'Incorrect username or password'
      } );
    } else {
      res.send(authUser);
    }
});

module.exports = router;
