const moment = require("moment"); // for date checking
const { ObjectId } = require("mongodb");

async function createMessage(sender, message) {
  //let recipient = body.recipient;

  // Sender Error Checking
  if (!sender) throw "createMessage: Missing sender";
  if (typeof sender !== "string")
    throw `createMessage: sender must be a string`;
  if (sender.trim().length === 0)
    throw "createMessage: sender must not be an empty string";

  // Recipient Error Checking
  // if (!recipient) throw "createMessage: Missing recipient";
  // if (typeof recipient !== "string")
  //   throw `createMessage: recipient must be a string`;
  // if (recipient.trim().length === 0)
  //   throw "createMessage: recipient must not be an empty string";

  // Message Error Checking
  if (!message) throw "createMessage: Missing message";
  if (typeof message !== "string")
    throw `createMessage: message must be a string`;
  if (message.trim().length === 0)
    throw "createMessage: message must not be an empty string";

  const newMessage = {
    _id: new ObjectId(),
    sender: ObjectId(sender),
    //recipient: ObjectId(recipient),
    message: message,
    timeStamp: new Date(),
  };

  return newMessage;
}

module.exports = {
  createMessage,
};
