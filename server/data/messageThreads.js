const { messageThreads, users } = require("../config/mongoCollections");
const { createMessage } = require("./messages")
const moment = require("moment"); // for date checking
const { ObjectId } = require("mongodb");

async function createMessageThread(recipients) {
  //let message = body.message;

  // Recipients Error Checking
  if (!recipients) throw "createMessage: Missing recipients";
  if (!Array.isArray(recipients)) throw `createMessage: recipients must be an array`;
  if (recipients.length === 0)
    throw "createMessage: recipients must not be empty";

  // Message Error Checking
  // if (!message) throw "createMessage: Missing message";
  // if (typeof message !== "string")
  //   throw `createMessage: message must be a string`;
  // if (message.trim().length === 0)
  //   throw "createMessage: message must not be an empty string";

  const newMessageThread = {
    recipients: recipients,
    threadDate: new Date(),
    messageThread: [],
  };

  const messageThreadsCollection = await messageThreads();

  const insertInfo = await messageThreadsCollection.insertOne(newMessageThread);
  if (insertInfo.insertedCount === 0) throw "createMessage: Failed to create item";
  const id = insertInfo.insertedId.toString();
  console.log('message here')
  return await getMessageThreadById(id);
}

async function getAllMessageThreads() {
  const messageThreadsCollection = await messageThreads();
  const messageThreadList = await messageThreadsCollection.find({}).toArray();
  if (messageThreadList.length === 0) return [];
  for (let message of messageThreadList) {
    message._id = message._id.toString();
    message.recipients[0] = message.recipients[0].toString();
    message.recipients[1] = message.recipients[1].toString();
  }
  return messageThreadList;
}

async function getMessageThreadById(id) {
  // ID Error Checking
  if (!id) throw "getMessageThreadById: Missing id";
  if (typeof id !== "string")
    throw "getMessageThreadById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getMessageThreadById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const messageThreadsCollection = await messageThreads();
  const messageThread = await messageThreadsCollection.findOne({ _id: parsedId });
  console.log(messageThread)
  if (messageThread === null) throw `getMessageThreadById: Failed to find messageThread with id '${id}'`;
  messageThread._id = messageThread._id.toString();
  messageThread.recipients[0] = messageThread.recipients[0].toString();
  messageThread.recipients[1] = messageThread.recipients[1].toString();
  return messageThread;
}

async function deleteMessageThreadById(id) {
  if (!id) throw "deleteMessageThreadById: Missing id";
  if (typeof id !== "string")
    throw "deleteMessageThreadById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "deleteMessageThreadById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const messageThreadsCollection = await items();
  const deletionInfo = await messageThreadsCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) {
    throw "deleteMessageThreadById: Failed to delete item";
  }
  return { deleted: true };
}

// async function getItemsByCategory(category) {
//   if (!category) throw "getItemsByCategory: Missing category";
//   if (typeof category !== "string")
//     throw "getItemsByCategory: The provided category must be a string";
//   if (category.trim().length === 0)
//     throw "getItemsByCategory: The provided category must not be an empty string";

//   const itemCollection = await items();
//   const itemsList = await itemCollection.find({ categories: category }).toArray();
//   for (let item of itemsList) {
//     item._id = item._id.toString();
//     item.sellerId = item.sellerId.toString();
//   }
//   return itemsList;
// }

async function addMessageToThread(messageThreadId, senderId, message) {
  const messageThreadsCollection = await messageThreads();
  let oldThread = await getMessageThreadById(messageThreadId);

  let messageThread = oldThread.messageThread
  let newMessage = await createMessage(senderId, message)
  messageThread.push(newMessage)
  console.log(messageThread)

  const newMessageThread = {
    recipients: oldThread.recipients,
    threadDate: oldThread.threadDate,
    messageThread: messageThread,
  };

  const updateInfo = await messageThreadsCollection.updateOne({ _id: ObjectId(messageThreadId) }, { $set: newMessageThread });
  if (updateInfo.modifiedCount === 0) throw "addMessageToThread: Failed to add message";
  return getMessageThreadById(messageThreadId);
}

async function getItemsBySeller(sellerId) {
  if (!sellerId) throw "getItemsBySeller: Missing sellerId";
  if (typeof sellerId !== "string")
    throw "getItemsBySeller: The provided sellerId must be a string";
  if (sellerId.trim().length === 0)
    throw "getItemsBySeller: The provided sellerId must not be an empty string";

  const itemCollection = await items();
  const itemsList = await itemCollection.find({ sellerId: ObjectId(sellerId.trim()) }).toArray();
  for (let item of itemsList) {
    item._id = item._id.toString();
    item.sellerId = item.sellerId.toString();
  }
  return itemsList;
}

module.exports = {
  createMessageThread,
  getAllMessageThreads,
  getMessageThreadById,
  deleteMessageThreadById,
  addMessageToThread,
  getItemsBySeller
};
