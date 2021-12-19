const express = require("express"),
      router = express.Router(),
      data = require('../data'),
      xss = require('xss')

router.get('/:id', async (req, res) => {
    return;
})

router.post('/:seller', async (req, res) => {
  let body = req.body;
  let buyer = xss(body.buyer);
  let seller = xss(req.params.seller);
  let message = xss(body.message);

  if (!buyer || buyer.trim().length == 0) { return res.status(400).json({ error: "buyer not valid" }) };
  if (!seller || seller.trim().length == 0) { return res.status(400).json({ error: "seller not valid" }) };
  if (!message || message.trim().length == 0) { return res.status(400).json({ error: "message not valid" }) };
  
  if (buyer.toString() === seller.toString()) { return res.status(400).json({error: "cannot message self"}) }

  let buyerObj = {}
  try {
    buyerObj = await data.users.getUserByEmail(buyer)
  } catch (e) {
    return res.status(404).json({ error: "buyer doesn't exist" })
  }

  let sellerObj = {}
  try {
    sellerObj = await data.users.getUserById(seller)
  } catch (e) {
    return res.status(404).json({ error: "seller doesn't exist" })
  }

  if (!req.currentUser || req.currentUser.email.toString() != buyer.toString()) {
    return res.status(403).json({ error: "can't message from a different account" })
  }

  try {
    let messageThread = await data.messageThreads.createMessageThread({buyer: buyerObj._id.toString(), seller: sellerObj._id.toString(), message: message})
    return res.json(messageThread)
  } catch (e) {
    return res.status(500).json({error: e})
  }
})

module.exports = router;