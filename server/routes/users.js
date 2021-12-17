const express = require("express"),
      router = express.Router(),
      data = require('../data'),
      xss = require('xss')

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/email/', async (req, res) => {
  let body = req.body;
  let emailAddress = req.body.emailAddress
  if (!emailAddress || emailAddress.trim().length == 0) { return res.status(400).json({ error: "emailAddress not valid" }) };
  try {
    let user = await data.users.getUserByEmail(emailAddress);
    delete user.passwordHash;
    return res.json(user);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: `user with emailAddress ${emailAddress} does not exist` })
  }
})

router.get('/:id', async (req, res) => {
  let id = req.params.id
  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  let userData = await client.hgetAsync("user", `${id}`);
  if (userData) { return res.json(JSON.parse(userData)) }
  // console.log("in route")
  try {
    let user = await data.users.getUserById(id);
    delete user.passwordHash;
    let userDataCached = await client.hsetAsync("user", `${id}`, JSON.stringify(user));
    return res.json(user);
  } catch (e) {
    return res.status(404).json({ error: `user with id ${id} does not exist` })
  }
})

router.post('/', async (req, res) => {
  // get body + xss body
  let body = req.body
  let password = xss(body.password)
  let username = xss(body.username)
  let firstName = xss(body.firstName)
  let lastName = xss(body.lastName)
  let emailAddress = xss(body.emailAddress)
  // console.log(password)
  // error checking
  if (!password || password.trim().length == 0) { return res.status(400).json({ error: "password not valid" }) };
  if (!username || username.trim().length == 0) { return res.status(400).json({ error: "username not valid" }) };
  if (!firstName || firstName.trim().length == 0) { return res.status(400).json({ error: "firstName not valid" }) };
  if (!lastName || lastName.trim().length == 0) { return res.status(400).json({ error: "lastName not valid" }) };
  if (!emailAddress || emailAddress.trim().length == 0) { return res.status(400).json({ error: "emailAddress not valid" }) };
  // check if username already exists
  let allUsers = await data.users.getAllUsers();
  for (i of allUsers) {
    if (i.username === username.toLowerCase()) {
      return res.status(403).json({ error: "username already exists" })
    }
    if (i.emailAddress === emailAddress.toLowerCase()) {
      return res.status(403).json({ error: `account using emailAddress ${emailAddress} already exists` })
    }
  }
  // try to create user
  try {
    let user = await data.users.createUser({ name: { firstName: firstName, lastName: lastName }, password: password, username: username, emailAddress: emailAddress })
    delete user.passwordHash
    return res.json(user);
  } catch (e) {
    console.log("server error", e)
    return res.status(500).json({ error: e })
  }
})

module.exports = router;