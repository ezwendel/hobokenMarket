const express = require("express"),
      router = express.Router(),
      data = require('../data'),
      xss = require('xss')

router.get('/:id', async (req, res) => {
  let id = req.params.id
  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  console.log("in route")
  try {
    let item = await data.items.getItemById(id);
    return res.json(item);
  } catch (e) {
    return res.status(404).json({ error: `item with id ${id} does not exist` })
  }
})

router.post('/', async (req, res) => {
  // get body + xss body
  let body = req.body
  let name = xss(body.name);
  let description = xss(body.description);
  let sellerId = xss(body.sellerId);
  // let itemPictures = xss(body.itemPictures);
  let categories = body.categories; // xss later
  // error checking
  if (!name || name.trim().length == 0) { return res.status(400).json({ error: "name not valid" }) };
  if (!description || description.trim().length == 0) { return res.status(400).json({ error: "description not valid" }) };
  if (!sellerId || sellerId.trim().length == 0) { return res.status(400).json({ error: "sellerId not valid" }) };
  if (!categories || !Array.isArray(categories) || categories.length == 0) { return res.status(400).json({ error: "categories not valid" }) };
  // see if seller exists
  let allUsers = await data.users.getAllUsers();
  let sellerExists = false;
  for (i of allUsers) {
    if (i._id.toString() === sellerId.toString()) {
      sellerExists = true;
      break;
    }
  }
  if (!sellerExists) { return res.status(404).json({ error: `user with id ${sellerId} does not exist` }) }
  // try to create item
  try {
    let item = await data.items.createItem({ name: name, description: description, sellerId: sellerId, categories: categories })
    await data.users.addItemToUser(sellerId, item._id)
    return res.json(item);
  } catch (e) {
    console.log("server error", e)
    return res.status(500).json({ error: e })
  }
})

module.exports = router;