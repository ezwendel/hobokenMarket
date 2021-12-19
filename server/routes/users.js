const express = require("express"),
  router = express.Router(),
  data = require('../data'),
  xss = require('xss')

const bluebird = require('bluebird');
const redis = require('redis');
const redisOptions = {
  host: process.env.DOCKER_MODE ? 'redis' : 'localhost',
  port: 6379,
};
const client = redis.createClient(redisOptions);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && 
         !isNaN(parseFloat(str));
}

router.get('/email/:email', async (req, res) => {
  let emailAddress = req.params.email;
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
  let cell = xss(body.numbers.cell);
  let home = xss(body.numbers.home);
  // console.log(password)
  // error checking
  if (!password || password.trim().length == 0) { return res.status(400).json({ error: "password not valid" }) };
  if (!username || username.trim().length == 0) { return res.status(400).json({ error: "username not valid" }) };
  if (!firstName || firstName.trim().length == 0) { return res.status(400).json({ error: "firstName not valid" }) };
  if (!lastName || lastName.trim().length == 0) { return res.status(400).json({ error: "lastName not valid" }) };
  if (!emailAddress || emailAddress.trim().length == 0) { return res.status(400).json({ error: "emailAddress not valid" }) };
  if (!body.numbers) { return res.status(400).json({ error: "missing numbers" })};
  const numberRegex = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  if (cell === undefined) {
    return res.status(400).json({ error: "missing cell number" });
  } else {
    if (cell !== "") {
      if (cell.trim().length === 0)
        return res.status(400).json({ error: "cell number is not valid" });
      if (!numberRegex.test(cell))
        return res.status(400).json({ error: "cell number is not valid" });
    } else {
      cell = null;
    }
  }
  if (home === undefined) {
    return res.status(400).json({ error: "home number is not valid" });
  } else {
    if (home !== "") {
      if (home.trim().length === 0)
        return res.status(400).json({ error: "home number is not valid" });
      if (!numberRegex.test(home))
        return res.status(400).json({ error: "home number is not valid" });
    } else {
      home = null;
    }
  }

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
    let user = await data.users.createUser({ name: { firstName: firstName, lastName: lastName }, password: password, username: username, emailAddress: emailAddress, numbers: { cell: cell, home: home } })
    delete user.passwordHash
    return res.json(user);
  } catch (e) {
    console.log("server error", e)
    return res.status(500).json({ error: e })
  }
})

router.post('/rating', async (req, res) => {
  // get body + xss body
  let body = req.body;
  let userId = xss(body.userId);
  let raterId = xss(body.raterId);
  let rating = xss(body.rating);
  if (!userId || userId.trim().length == 0) { return res.status(400).json({ error: "userId not valid" }) };
  if (!raterId || raterId.trim().length == 0) { return res.status(400).json({ error: "raterId not valid" }) };
  if (rating === undefined || !isNumeric(rating)) { return res.status(400).json({ error: "rating not valid" }) };
  let parsed_rating = parseInt(rating);
  if (parsed_rating < 0 || parsed_rating > 5) { return res.status(400).json({ error: "rating must be between 0 and 5" }) };

  // Check if rater exists
  try {
    let rater = await data.users.getUserById(raterId);
  } catch (e) {
    return res.status(404).json({ error: `user with id ${raterId} does not exist` })
  }
  try {
    let user = await data.users.addRatingToUser(userId, raterId, parsed_rating);
    let userDataCached = await client.hsetAsync("user", `${userId}`, JSON.stringify(user));
    return res.json(user);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: `failed to add rating to user with id ${userId}` })
  }
})

module.exports = router;