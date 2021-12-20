const { readMessage } = require("../data/messageThreads");

const express = require("express"),
      router = express.Router(),
      data = require('../data'),
      xss = require('xss'),
      nodemailer = require('nodemailer')

router.post('/message/:id', async (req, res) => {
  let id = xss(req.params.id);
  let sender = xss(req.body.sender); // should be an email
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
    let messageThread = await data.messageThreads.getMessageThreadById(id.toString())
    let receiver = null
    if (messageThread.buyer.toString() === senderObj._id.toString()) {
      receiver = await data.users.getUserById(messageThread.seller.toString())
    } else {
      receiver = await data.users.getUserById(messageThread.buyer.toString())
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'elijahhbmarket@gmail.com', // generated ethereal user
        pass: '97gH8pYSWx8Ttm9', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Elijah Wendel HBMarket" <elijahhbmarket@gmail.com>', // sender address
      to: receiver.emailAddress, // list of receivers
      subject: "You've received a message!", // Subject line
      text: `Check your Hoboken Market Account! A new message has arrived from user ${senderObj.username}!`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return res.json(newMessage)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
})

router.post('/close/:id', (req, res) => {
  
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
    sellerObj = await data.users.getUserByEmail(seller)
  } catch (e) {
    return res.status(404).json({ error: "seller doesn't exist" })
  }

  if (!req.currentUser || req.currentUser.email.toString() != buyer.toString()) {
    return res.status(403).json({ error: "can't message from a different account" })
  }

  try {
    let messageThread = await data.messageThreads.createMessageThread({buyer: buyerObj._id.toString(), seller: sellerObj._id.toString(), message: message})
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'elijahhbmarket@gmail.com', // generated ethereal user
        pass: '97gH8pYSWx8Ttm9', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Elijah Wendel HBMarket" <elijahhbmarket@gmail.com>', // sender address
      to: sellerObj.emailAddress, // list of receivers
      subject: "You've received a message!", // Subject line
      text: `Check your Hoboken Market Account! A message has arrived from user ${buyerObj.username}!`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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
    user = await data.users.getUserByEmail(email);
    console.log(user);
  } catch (e) {
    return res.status(404).json({error: "user doesn't exist"})
  }
  console.log(req.currentUser);
  if (!req.currentUser && req.currentUser.email.toString() !== email) {
    return res.status(403).json({error: "user does not have perms to read these messages"})
  }
  try {
    console.log('here')
    let messageThreads = await data.messageThreads.getUserMessageThreads(user._id.toString());
    return res.json(messageThreads)
  } catch (e) {
    console.log(e);
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
    let messageThread = await data.messageThreads.getMessageThreadById(id)
    let currentUserObj = await data.users.getUserByEmail(req.currentUser.email)
    console.log(currentUserObj._id.toString(), "curr obj")
    console.log(messageThread.buyer.toString(), "buyer")
    console.log(messageThread.seller.toString(), "seller")
    if (currentUserObj._id.toString() != messageThread.seller.toString() && currentUserObj._id.toString() != messageThread.buyer.toString()) {
      return res.status(403).json({error: "don't have permission to view these messages"})
    }
    for (let message of messageThread.messages) { // read messages here
      if (message.sender.toString() !== currentUserObj._id.toString() && !message.read) {
        let readMessage = await data.messageThreads.readMessage(message._id.toString())
        console.log(readMessage)
      }
    }
    return res.json(messageThread)
  } catch (e) {
    console.log(e)
    return res.status(500).json({error: e})
  }
})

module.exports = router;