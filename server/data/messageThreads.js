const { messageThreads } = require("../config/mongoCollections");
const moment = require("moment"); // for date checking
const { ObjectId } = require("mongodb");
const { deleteImage } = require('./images')

function sortArraysByLastMessageSent(arr) {
  arr.sort((a,b) => {
    return new Date(b.mostRecentMessageTime) - new Date(a.mostRecentMessageTime)
  })
  return arr;
}

async function createMessageThread(body) {
  let buyer = body.buyer;
  let seller = body.seller;
  let message = body.message;

  // Buyer Error Checking
  if (!buyer) throw "createMessageThread: Missing buyer";
  if (typeof buyer !== "string") throw `createMessageThread: buyer must be a string`;
  if (buyer.trim().length === 0)
    throw "createMessageThread: buyer must not be an empty string";

  // Seller Error Checking
  if (!seller) throw "createMessageThread: Missing description";
  if (typeof seller !== "string")
    throw `createMessageThread: description must be a string`;
  if (seller.trim().length === 0)
    throw "createMessageThread: description must not be an empty string";

  // First Message Error Checking
  if (!message) throw "createMessageThread: Missing message";
  if (typeof message !== "string")
    throw `createMessageThread: message must be a string`;
  if (message.trim().length === 0)
    throw "createMessageThread: message must not be an empty string";

  const meassageThreadsCollection = await messageThreads();

  if (buyer.toString() === seller.toString()) throw 'createMessageThread: buyer and seller cannot be the same'

  const firstMessage = {
    _id: ObjectId(),
    sender: buyer,
    message: message,
    read: false,
    time: new Date()
  }

  const newMessageThread = {
    buyer: ObjectId(buyer),
    seller: ObjectId(seller),
    messages: [firstMessage],
    open: true,
    mostRecentMessageTime: new Date()
  };

  const insertInfo = await meassageThreadsCollection.insertOne(newMessageThread);
  if (insertInfo.insertedCount === 0) throw "createMessageThread: Failed to create messageThread";
  const id = insertInfo.insertedId.toString();
  return await getMessageThreadById(id);
}

async function createMessage(body) {
  let messageThreadId = body.messageThreadId
  let sender = body.sender
  let message = body.message

  // Message Error Checking
  if (!messageThreadId) throw "createMessage: Missing messageThreadId";
  if (typeof messageThreadId !== "string")
    throw `createMessage: messageThreadId must be a string`;
  if (messageThreadId.trim().length === 0)
    throw "createMessage: messageThreadId must not be an empty string";

  // Seller Error Checking
  if (!sender) throw "createMessage: Missing sender";
  if (typeof sender !== "string")
    throw `createMessage: sender must be a string`;
  if (sender.trim().length === 0)
    throw "createMessage: sender must not be an empty string";

  // Message Error Checking
  if (!message) throw "createMessage: Missing message";
  if (typeof message !== "string")
    throw `createMessage: message must be a string`;
  if (message.trim().length === 0)
    throw "createMessage: message must not be an empty string";

  const newMessage = {
    _id: ObjectId(),
    sender: sender,
    message: message,
    read: false,
    time: new Date()
  }

  const meassageThreadsCollection = await messageThreads();

  let messageThread = await getMessageThreadById(messageThreadId);
  messageThread.push(newMessage)

  delete messageThread._id

  messageThread.mostRecentMessageTime = new Date() 

  const updateInfo = await meassageThreadsCollection.updateOne(
    { _id: ObjectId(messageThreadId) },
    { $set: messageThread }
  );

  if (updateInfo.modifiedCount === 0) throw "createMessage: Failed to update messageThread with new message";
  return await getMessageThreadById(messageThreadId);
}

async function readMessage(id) {
  // ID Error Checking
  if (!id) throw "getMessageById: Missing id";
  if (typeof id !== "string")
    throw "getMessageById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getMessageById: The provided id must not be an empty string";
  
  let messageThread = getParentMessageThreadByMessageId(id);

  let messageThreadId = messageThread._id

  newMessages = []
  for (message of messageThread.messages) {
    if (message._id.toString() === id) {
      message.read = true;
      newMessages.push(message)
    } else {
      newMessages.push(message)
    }
  }

  messageThread.messages = newMessages

  delete messageThread._id

  const updateInfo = await meassageThreadsCollection.updateOne(
    { _id: ObjectId(messageThreadId) },
    { $set: messageThread }
  );

  if (updateInfo.modifiedCount === 0) throw "createMessage: Failed to update messageThread with new message";
  return await getMessageThreadById(messageThreadId);
}

async function getMessageThreadById(id) {
  // ID Error Checking
  if (!id) throw "getMessageThreadById: Missing id";
  if (typeof id !== "string")
    throw "getMessageThreadById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getMessageThreadById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const meassageThreadsCollection = await messageThreads();
  const messageThread = await meassageThreadsCollection.findOne({ _id: parsedId });
  if (messageThread === null) throw `getMessageThreadById: Failed to find messageThread with id '${id}'`;
  messageThread._id = messageThread._id.toString();

  for (message of messageThread.messages) {
    message._id = message._id.toString()
  }

  return messageThread;
}

async function getParentMessageThreadByMessageId(id) {
  // ID Error Checking
  if (!id) throw "getMessageById: Missing id";
  if (typeof id !== "string")
    throw "getMessageById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getMessageById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const meassageThreadsCollection = await messageThreads();
  const messageThread = await meassageThreadsCollection.findOne({ "message._id": parsedId });
  if (messageThread === null) throw `getMessageById: Failed to find messageThread containing message with id '${id}'`;
  messageThread._id = messageThread._id.toString();
  
  for (message of messageThread.messages) {
    message._id = message._id.toString()
  }
  return messageThread;
}

async function getMessageById(id) {
  // ID Error Checking
  if (!id) throw "getMessageById: Missing id";
  if (typeof id !== "string")
    throw "getMessageById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getMessageById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const meassageThreadsCollection = await messageThreads();
  const messageThread = await meassageThreadsCollection.findOne({ "message._id": parsedId });
  if (messageThread === null) throw `getMessageById: Failed to find messageThread containing message with id '${id}'`;
  messageThread._id = messageThread._id.toString();

  for (message of messageThread.messages) {
    if (message._id.toString() == id) {
      message._id = message._id.toString()
      return message;
    }
  }
  throw `Failed to find message with id '${id}'`;
}

async function getSellerMessageThreads(id) {
  if (!id) throw "getSellerMessageThreads: Missing id";
  if (typeof id !== "string")
    throw "getSellerMessageThreads: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getSellerMessageThreads: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const meassageThreadsCollection = await messageThreads();
  const messageThreadList = await meassageThreadsCollection.find({ "seller": parsedId }).toArray();
  for (messageThread of messageThreadList) {
    messageThread._id = messageThread._id.toString()
    for (message of messageThread) {
      message._id = message._id.toString();
    }
  }
  return sortArraysByLastMessageSent(messageThreadList)
}

async function getBuyerMessageThreads(id) {
  if (!id) throw "getBuyerMessageThreads: Missing id";
  if (typeof id !== "string")
    throw "getBuyerMessageThreads: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getBuyerMessageThreads: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const meassageThreadsCollection = await messageThreads();
  const messageThreadList = await meassageThreadsCollection.find({ "buyer": parsedId }).toArray();
  for (messageThread of messageThreadList) {
    messageThread._id = messageThread._id.toString()
    for (message of messageThread) {
      message._id = message._id.toString();
    }
  }
  return sortArraysByLastMessageSent(messageThreadList)
}

async function getUserMessageThreads(id) {
  if (!id) throw "getUserMessageThreads: Missing id";
  if (typeof id !== "string")
    throw "getUserMessageThreads: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getUserMessageThreads: The provided id must not be an empty string";
  
  let sellerMessageThreads = await getSellerMessageThreads(id);
  let buyerMessageThreads = await getBuyerMessageThreads(id);

  return sortArraysByLastMessageSent(sellerMessageThreads.concat(buyerMessageThreads))
}

async function closeMessageThread(id) {
  if (!id) throw "closeMessageThread: Missing id";
  if (typeof id !== "string")
    throw "closeMessageThread: The provided id must be a string";
  if (id.trim().length === 0)
    throw "closeMessageThread: The provided id must not be an empty string";

  const meassageThreadsCollection = await messageThreads();

  let messageThread = await getMessageThreadById(id);

  delete messageThread._id

  messageThread.open = false;

  const updateInfo = await meassageThreadsCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: messageThread }
  );

  if (updateInfo.modifiedCount === 0) throw "closeMessageThread: Failed to close messageThread";
  return await getMessageThreadById(id);
}

module.exports = {
  createMessage, 
  createMessageThread,
  readMessage,
  getMessageById,
  getMessageThreadById,
  getParentMessageThreadByMessageId,
  getSellerMessageThreads,
  getBuyerMessageThreads,
  getUserMessageThreads,
  closeMessageThread,
}
