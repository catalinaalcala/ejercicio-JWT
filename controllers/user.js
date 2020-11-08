const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'users';
const bcrypt = require('bcrypt');
const auth = require('../lib/utils/auth.js');
const saltRounds = 10;

async function login(user) {
    return mongoUtils.conn().then(async (client) => {
      const requestedUser = await client
        .db(dataBase)
        .collection(COLLECTION_NAME)
        .findOne({username: user.username})
        .finally(() => client.close());

      let userAns = null;
      const isValid = await bcrypt.compare(user.password, requestedUser.password);
      if (isValid) {
        let token = auth.createToken(user.username);
        userAns = {
          success: true,
          username: user.username,
          token: token
        };
      }  else {
        userAns = {
          success: false
        }
      }
      return userAns;
      
  });
  }

async function createUser(user) {
  if(user.password){
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      user.password = hash;
    });
  }
  // Save new user with password hashed
  return mongoUtils.conn().then(async (client) => {
    const newUser = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(user)
      .finally(() => client.close());
  // TODO Delete sensitive information
    newUser = {
      username: newUser.username
    };
    return newUser;
});
}

module.exports = [createUser, login];
