const express = require("express"),
      router = express.Router(),
      data = require('../data'),
      xss = require('xss')

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const upload = require('../middleware/upload')

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/search/', async (req, res) => {
  let keyword = req.body.keyword;
  if (!keyword || keyword.trim().length == 0) { return res.status(400).json({ error: "keyword not valid" }) };
  let searchData = await client.hgetAsync("search", `${keyword}`);
  if (searchData) { return res.json(JSON.parse(searchData)) }
  try {
    let searchResults = await data.items.search(keyword);
    let searchResultsCached = await client.hsetAsync("search", `${keyword}`, JSON.stringify(searchResults))
    return res.json(searchResults);
  } catch (e) {
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
  let itemsData = await client.hgetAsync("items", `${searchStr}`);
  if (itemsData) { return res.json(JSON.parse(itemsData)) }
  try {
    let items = await data.items.getAllItems()
    // console.log(req.query);
    if (req.query.offset) {
      let offset = Number(req.query.offset);
      // console.log(skipNum);
      if (offset < 0) {
        res.status(400).json({error: "offset query cannot be less than 0"});
        return;
      } else {
        items.splice(0, offset);
      }
    }
    if (req.query.count) {
      let count = Number(req.query.count);
      if (count < 0) {
        res.status(400).json({error: "Take query cannot be less than 0"});
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
    return res.status(500).json({error: e});
  }
})

router.post('/with_image', upload.single("file"), async (req, res) => {
  if (req.file === undefined) return res.status(400).json({error: "must select a file."})

  // get body + xss body
  let body = req.body
  let name = xss(body.name);
  let description = xss(body.description);
  let sellerId = xss(body.sellerId);
  let itemPictures = [req.file.id];
  let categories = body.categories.split(","); // xss later
  // error checking
  if (!name || name.trim().length == 0) { return res.status(400).json({ error: "name not valid" }) };
  if (!description || description.trim().length == 0) { return res.status(400).json({ error: "description not valid" }) };
  if (!sellerId || sellerId.trim().length == 0) { return res.status(400).json({ error: "sellerId not valid" }) };

  if (!categories || !Array.isArray(categories) || categories.length == 0) { return res.status(400).json({ error: "categories not valid" }) };
  // see if seller exists
  let seller = null;
  try {
    seller = await data.users.getUserById(sellerId);
  } catch (e) {
    console.log(e)
    return res.status(404).json({ error: `user with id ${sellerId} does not exist` }) 
  }
  try {
    let item = await data.items.createItem({ name: name, description: description, sellerId: sellerId, categories: categories, itemPictures: itemPictures })
    let sellerWithItem = await data.users.addItemToUser(sellerId, item._id)
    delete sellerWithItem.passwordHash;
    // update user with new items in cache
    let userDataCached = await client.hsetAsync("user", `${sellerId}`, JSON.stringify(sellerWithItem));
    // delete get items and search cache
    let itemsDataCached = await client.delAsync("items")
    let searchDataCached = await client.delAsync("search")
    return res.json(item);
  } catch (e) {
    console.log("server error", e)
    return res.status(500).json({ error: e })
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
    // delete get items and search cache
    let itemsDataCached = await client.delAsync("items")
    let searchDataCached = await client.delAsync("search")
    return res.json(item);
  } catch (e) {
    console.log("server error", e)
    return res.status(500).json({ error: e })
  }
})

module.exports = router;