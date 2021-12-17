const express = require("express"),
  router = express.Router(),
  data = require('../data'),
  xss = require('xss'),
  im = require('imagemagick')

router.get('/:id', async (req, res) => {
  let id = req.params.id
  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  // console.log("in route")
  try {
    let item = await data.items.getItemById(id);
    return res.json(item);
  } catch (e) {
    return res.status(404).json({ error: `item with id ${id} does not exist` })
  }
})

router.get('/', async (req, res) => {
  try {
    let items = await data.items.getAllItems()
    // console.log(req.query);
    if (req.query.offset) {
      let offset = Number(req.query.offset);
      // console.log(skipNum);
      if (offset < 0) {
        res.status(400).json({ error: "offset query cannot be less than 0" });
        return;
      } else {
        items.splice(0, offset);
      }
    }
    if (req.query.count) {
      let count = Number(req.query.count);
      if (count < 0) {
        res.status(400).json({ error: "Take query cannot be less than 0" });
        return;
      } else {
        items = items.slice(0, count);
      }
    } else {
      items = items.slice(0, 20); // 20 is default take
    }
    items = items.slice(0, 100); // max 100 blogs
    res.json(items);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
})

router.post('/', async (req, res) => {
  // get body + xss body
  let body = req.body
  let name = xss(body.name);
  let description = xss(body.description);
  let sellerId = xss(body.sellerId);
  let itemPictures = xss(body.pictures);//xss(body.itemImage);
  im.convert(['Bday.png', '-resize', '256x256'],
    function (err, stdout) {
      if (err) throw err;
      console.log('stdout:', stdout);
    });
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