const express = require("express"),
      router = express.Router(),
      data = require('../data'),
      xss = require('xss')

router.post('/message/:id', async (req, res) => {
  let id = xss(req.params.id);
  let sender = xss(req.body.message); // should be an email
  let message = xss(req.body.message); 

  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  if (!sender || sender.trim().length == 0) { return res.status(400).json({ error: "sender not valid" }) };
  if (!message || message.trim().length == 0) { return res.status(400).json({ error: "message not valid" }) };

  let senderObj = {}
  try {
    senderObj = await data.users.getUserByEmail(sender)
  } catch (e) {
    return res.status(404).json({ error: "sender doesn't exist" })
  }

  if (!req.currentUser || req.currentUser.email.toString() != sender.toString()) {
    return res.status(403).json({ error: "can't message from a different account" })
  }

  try {
    let newMessage = await data.messageThreads.createMessage({messageThreadId: id.toString(), sender: senderObj._id.toString(), message: message.toString()})
    return res.json(newMessage)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

router.post('/read_message/:id', async (req, res) => {
  let id = xss(req.params.id);

  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };

  let message = null;
  let messageThread = null;
  try {
    message = await data.messageThreads.getMessageById(id.toString())
    messageThread = await data.messageThreads.getParentMessageThreadByMessageId(id.toString())
  } catch (e) {
    return res.status(404).json({error: "message doesn't exist"})
  }

  let currentUserObj = null;
  try {
    currentUserObj = await data.users.getUserByEmail(req.currentUser.email.toString())
  } catch (e) {
    return res.status(401).json({error: "can't read a message without being logged in"})
  }

  let receiver = null;
  if (messageThread.seller.toString() === message.sender.toString()) {
    receiver = messageThread.buyer.toString()
  } else {
    receiver = messageThread.seller.toString()
  }

  if (!req.currentUser || currentUserObj._id.toString() != receiver.toString()) {
    return res.status(403).json({ error: "can't read message from a different account" })
  }

  try {
    let newMessageThread = await data.messageThreads.readMessage(id.toString())
    return res.json(newMessageThread);
  } catch (e) {
    return res.status(500).json({error: e})
  }
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

router.get('/all_threads_for_user/:email', async (req, res) => {
  let email = xss(req.params.email)

  if (!email || email.trim().length == 0) { return res.status(400).json({ error: "email not valid" }) };

  let user = null;
  try {
    user = await data.getUserByEmail(email);
  } catch (e) {
    return res.status(404).json({error: "user doesn't exist"})
  }

  if (!req.currentUser && req.currentUser.email.toString() !== email) {
    return res.status(403).json({error: "user does not have perms to read these messages"})
  }

  try {
    let messageThreads = await data.messageThreads.getUserMessageThreads(user._id.toString());
    return res.json(messageThreads)
  } catch (e) {
    return res.status(500).json({error: e})
  }
})

router.get('/:id', async (req, res) => {
  let id = xss(req.params.id)
  
  if (!id || id.trim().length == 0) { return res.status(400).json({ error: "id not valid" }) };
  
  if (!req.currentUser) {
    return res.status(401).json({error: "can't view messages without being logged in"})
  }

  try {
    let messageThread = await data.messageThreads.getMessageThreadById()
    let currentUserObj = await data.users.getUserByEmail()
    if (currentUserObj._id.toString() != messageThread.seller || currentUserObj._id.toString() != messageThread.buyer) {
      return res.status(403).json({error: "don't have permission to view these messages"})
    }
    return res.json(messageThread)
  } catch (e) {
    return res.status(500).json({error: e})
  }
})

module.exports = router;