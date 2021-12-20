const express = require("express"),
  router = express.Router(),
  data = require('../data'),
  xss = require('xss'),
  gm = require('gm'),
  fs = require('fs')

const bluebird = require('bluebird');
const redis = require('redis');
const redisOptions = {
  host: process.env.DOCKER_MODE ? 'redis' : 'localhost',
  port: 6379,
};
const client = redis.createClient(redisOptions);
const upload = require('../middleware/upload')


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function containsDuplicates(arr) {
  return (new Set(arr)).size !==  arr.length;
}

router.get('/search/:keyword', async (req, res) => {
  let keyword = req.params.keyword;
  if (!keyword || keyword.trim().length == 0) { return res.status(400).json({ error: "keyword not valid" }) };
  let searchData = await client.hgetAsync("search", `${keyword}`);
  if (searchData) { return res.json(JSON.parse(searchData)) }
  try {
    let searchResults = await data.items.search(keyword);
    let searchResultsCached = await client.hsetAsync("search", `${keyword}`, JSON.stringify(searchResults))
    return res.json(searchResults);
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
})

router.get('/:id', async (req, res) => {
  let id = req.params.id
  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  let itemData = await client.hgetAsync("item", `${id}`);
  if (itemData) { return res.json(JSON.parse(itemData)) }
  // console.log("in route")
  try {
    let item = await data.items.getItemById(id);
    let itemDataCached = await client.hsetAsync("item", `${id}`, JSON.stringify(item))
    return res.json(item);
  } catch (e) {
    return res.status(404).json({ error: `item with id ${id} does not exist` })
  }
})

router.get('/', async (req, res) => {
  let searchStr = ""
  if (req.query.offset) {
    searchStr += `offset:${req.query.offset}`
  }
  if (req.query.count) {
    searchStr += `count:${req.query.count}`
  }
  if (req.query.filter) {
    searchStr += `filter:${req.query.filter}`
  }
  if (req.query.latest && req.query.latest.toLowerCase() === 'false') {
    searchStr += `latest:false`
  }
  searchStr = searchStr.toLowerCase()
  let itemsData = await client.hgetAsync("items", `${searchStr}`);
  if (itemsData) { return res.json(JSON.parse(itemsData)) }
  try {
    let items;
    if (!req.query.filter) {
      items = await data.items.getAllItems();
    } else {
      items = await data.items.getItemsByCategory(req.query.filter);
    }
    // console.log(req.query);
    if (req.query.latest && req.query.latest.toLowerCase() === 'false') {
      items.reverse()
    }
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
    let itemsDataCached = await client.hsetAsync("items", `${searchStr}`, JSON.stringify(items))
    res.json(items);
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
})

router.post('/with_image', upload.single("file"), async (req, res) => {
  console.log("good");
  console.log(req.currentUser)
  console.log("why");
  if (req.file === undefined) return res.status(400).json({error: "must select a file."})
  const match = ["image/png", "image/jpeg"];
  if (match.indexOf(req.file.mimetype) === -1) {
    return res.status(400).json({ error: "can only submit images" })
  }
  console.log(req.file.id)
  // get body + xss body
  let body = req.body
  let name = xss(body.name);
  let description = xss(body.description);
  let sellerEmail = xss(body.sellerId);
  let itemPictures = [req.file.id.toString()];
  console.log(req.file)
  let categories = body.categories.split(","); // xss later
  console.log(body);
  // error checking
  if (!name || name.trim().length == 0) {
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      return res.status(400).json({ error: "name not valid" })
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "name not valid" })
    }
  };
  if (!description || description.trim().length == 0) {
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      return res.status(400).json({ error: "description not valid" })
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "description not valid" })
    }
  };
  if (!sellerEmail || sellerEmail.trim().length == 0) {
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      return res.status(400).json({ error: "sellerId not valid" })
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "sellerId not valid" })
    }
  };

  if (!categories || !Array.isArray(categories) || categories.length == 0) {
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      return res.status(400).json({ error: "categories not valid" })
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "categories not valid" })
    }
  };

  if (!req.currentUser || req.currentUser.email.toString() !== sellerEmail.toString()) {
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      return res.status(403).json({ error: "cannot post a different person's item" })
    } catch (e) {
      console.log(e);
      return res.status(403).json({ error: "cannot post a different person's item" })
    }
  };

  // see if seller exists
  let seller = null;
  try {
    seller = await data.users.getUserByEmail(sellerEmail);
  } catch (e) {
    console.log(e)
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      console.log("sellerId", sellerEmail);
      return res.status(404).json({ error: `user with email ${sellerEmail} does not exist` })
    } catch (e) {
      console.log(e);
      return res.status(404).json({ error: `user with email ${sellerEmail} does not exist` })
    }
  }
  try {
    let item = await data.items.createItem({ name: name, description: description, sellerId: seller._id.toString(), categories: categories, itemPictures: itemPictures })
    let sellerWithItem = await data.users.addItemToUser(seller._id.toString(), item._id)
    delete sellerWithItem.passwordHash;
    // update user with new items in cache
    let userDataCached = await client.hsetAsync("user", `${seller._id.toString()}`, JSON.stringify(sellerWithItem));
    // delete get items and search cache
    let itemsDataCached = await client.delAsync("items")
    let searchDataCached = await client.delAsync("search")
    return res.json(item);
  } catch (e) {
    console.log("server error", e)
    try {
      await data.images.deleteImage(req.file.id.toString()); 
      return res.status(500).json({ error: e })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: e })
    }
  }
})

router.post('/', async (req, res) => {
  // get body + xss body
  let body = req.body
  let name = xss(body.name);
  let description = xss(body.description);
  let sellerId = xss(body.sellerId);
  let itemPictures = xss(body.pictures);//xss(body.itemImage);

  let categories = body.categories; // xss later
  // error checking
  if (!name || name.trim().length == 0) { return res.status(400).json({ error: "name not valid" }) };
  if (!description || description.trim().length == 0) { return res.status(400).json({ error: "description not valid" }) };
  if (!sellerId || sellerId.trim().length == 0) { return res.status(400).json({ error: "sellerId not valid" }) };
  if (!categories || !Array.isArray(categories) || categories.length == 0 || containsDuplicates(categories)) { return res.status(400).json({ error: "categories not valid" }) };
  // see if seller exists
  let seller = null;
  try {
    seller = await data.users.getUserById(sellerId);
  } catch (e) {
    console.log(e)
    return res.status(404).json({ error: `user with id ${sellerId} does not exist` })
  }
  try {
    let item = await data.items.createItem({ name: name, description: description, sellerId: sellerId, categories: categories })
    let sellerWithItem = await data.users.addItemToUser(sellerId, item._id)
    delete sellerWithItem.passwordHash;
    // update user with new items in cache
    let userDataCached = await client.hsetAsync("user", `${sellerId}`, JSON.stringify(sellerWithItem));
    let itemsDataCached = await client.delAsync("items")
    let searchDataCached = await client.delAsync("search")
    return res.json(item);
  } catch (e) {
    console.log("server error", e)
    return res.status(500).json({ error: e })
  }
})

router.delete('/:id', async (req, res) => {
  let id = req.params.id
  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  try {
    let itemInfo=await data.items.getItemById(id);
    if (!req.currentUser) {
      return res.status(401).json({ error: "cannot delete an item without being logged in" })
    }
    let loggedInInfo = await data.users.getUserByEmail(req.currentUser.email) 
    if (itemInfo.sellerId.toString() !== loggedInInfo._id.toString()) {
      return res.status(403).json({ error: "cannot delete a different person's item" })
    }
    let delInfo = await data.items.deleteItemById(id);
    let deluserInfo= await data.users.deleteItemToUser(itemInfo.sellerId,id);
    let itemDataCached = await client.hdelAsync("item", `${id}`)
    let userDataCached = await client.hsetAsync("user", `${itemInfo.sellerId}`, JSON.stringify(deluserInfo));
    // delete get items and search cache
    let itemsDataCached = await client.delAsync("items")
    let searchDataCached = await client.delAsync("search")
    return res.json(deluserInfo);
  } catch (e) {
    console.log(e)
    return res.status(404).json({ error: `item with id ${id} does not exist` })
  }
})

module.exports = router;