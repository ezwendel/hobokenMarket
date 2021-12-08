const { items, users } = require('../config/mongoCollections')
const bcrypt = require('bcryptjs');
const { ObjectId } = require("mongodb");
const saltRounds = 16;

function clean(obj) {
  obj._id = obj._id.toString()
  return obj
}

async function createUser(body) {
  let name = body.name
  let username = body.username
  let password = body.password
  let profilePicture = body.profilePicture
  let emailAddress = body.emailAddress

  // Username Error Checking
  if (!username) throw "createUser: Missing username";
  if (typeof username !== "string") throw `createUser: username must be a string`;
  if (username.trim().length === 0)
    throw "createUser: username must not be an empty string";
  if (username.trim().length > 20)
    throw "createUser: username must not exceed 20 characters";

  // Name Error Checking
  if (!name) throw 'createUser: Missing name'
  if (typeof(name) != 'object') throw 'createUser: name must be an object';
  if (!name.firstName) throw 'createUser: Missing name.firstName';
  if (!name.lastName) throw 'createUser: Missing name.lastName';
  if (typeof(name.firstName) !== "string") throw `createUser: name.firstName must be a string`;
  if (typeof(name.lastName) !== "string") throw `createUser: name.lastName must be a string`;
  if (name.firstName.trim().length === 0)
    throw "createUser: name.firstName must not be an empty string";
  if (name.lastName.trim().length === 0)
    throw "createUser: name.lastName must not be an empty string";

  // Password Error Checking
  if (!password) throw "createUser: Missing password";
  if (typeof password !== "string") throw `createUser: password must be a string`;
  if (password.trim().length === 0)
    throw "createUser: password must not be an empty string";
  if (password.trim().length > 20)
    throw "createUser: password must not exceed 20 characters";

  // Email Address Error Checking

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailAddress) throw "createUser: Missing emailAddress";
  if (typeof emailAddress !== "string") throw `createUser: emailAddress must be a string`;
  if (emailAddress.trim().length === 0)
    throw "createUser: emailAddress must not be an empty string";
  if (emailRegex.test(emailAddress)) throw "createUser: emailAddress is not a vaild emailAddress";

  // TODO: profilePicture error checking

  const userCollection = await users();

  // Check if duplicate name from same seller
  let sameUsername = userCollection.find({ username: username }).toArray();
  if (sameUsername) throw `createUser: username "${username}" is taken`;

  let passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = {
    name: name.trim(),
    username: username.trim(),
    passwordHash: passwordHash,
    profilePicture: profilePicture,
    emailAddress: emailAddress.trim(),
    joinDate: new Date(),
    items: []
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "createItem: Failed to create item";
  const id = insertInfo.insertedId.toString();
  return getUserById(id);
}

async function updateUser(body) {
  let _id = body._id;
  let name = body.name
  let username = body.username
  let password = body.password
  let profilePicture = body.profilePicture
  let emailAddress = body.emailAddress
  let joinDate = body.joinDate
  let items = body.items

  let oldUser = getUserById(_id);

  // Username Error Checking
  if (!username) {username = oldUser.username};
  if (typeof username !== "string") throw `createUser: username must be a string`;
  if (username.trim().length === 0)
    throw "createUser: username must not be an empty string";
  if (username.trim().length > 20)
    throw "createUser: username must not exceed 20 characters";

  // Name Error Checking
  if (!name) {name = oldUser.name};
  if (typeof(name) != 'object') throw 'createUser: name must be an object';
  if (!name.firstName) throw 'createUser: Missing name.firstName';
  if (!name.lastName) throw 'createUser: Missing name.lastName';
  if (typeof(name.firstName) !== "string") throw `createUser: name.firstName must be a string`;
  if (typeof(name.lastName) !== "string") throw `createUser: name.lastName must be a string`;
  if (name.firstName.trim().length === 0)
    throw "createUser: name.firstName must not be an empty string";
  if (name.lastName.trim().length === 0)
    throw "createUser: name.lastName must not be an empty string";

  // Password Error Checking
  let passwordHash = '';
  if (password) {
    if (typeof password !== "string") throw `createUser: password must be a string`;
    if (password.trim().length === 0)
      throw "createUser: password must not be an empty string";
    if (password.trim().length > 20)
      throw "createUser: password must not exceed 20 characters";
    passwordHash = await bcrypt.hash(password, saltRounds);
  } else {
    passwordHash = oldUser.passwordHash;
  }
  
  // Email Address Error Checking

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailAddress) {emailAddress = oldUser.emailAddress};
  if (typeof emailAddress !== "string") throw `createUser: emailAddress must be a string`;
  if (emailAddress.trim().length === 0)
    throw "createUser: emailAddress must not be an empty string";
  if (emailRegex.test(emailAddress)) throw "createUser: emailAddress is not a vaild emailAddress";

  // TODO: profilePicture error checking

  const userCollection = await users();

  // Check if duplicate name from same seller
  // let sameUsername = userCollection.find({ username: username }).toArray();
  // if (sameUsername) throw `createUser: username "${username}" is taken`;

  const newUser = {
    name: name.trim(),
    username: username.trim(),
    passwordHash: passwordHash,
    profilePicture: profilePicture,
    emailAddress: emailAddress.trim(),
    joinDate: oldUser.joinDate,
    items: oldUser.items
  };

  const insertInfo = await userCollection.updateOne({ _id: ObjectId(_id) }, { $set: newUser });
  if (insertInfo.insertedCount === 0) throw "createItem: Failed to update user";
  const id = insertInfo.insertedId.toString();
  return getUserById(id);
}

async function getAllUsers() {
  const userCollection = await users();
  const usersList = await userCollection.find({}).toArray();
  if (usersList.length === 0) return [];
  for (let user of usersList) {
    user._id = user._id.toString();
    user.items = user.items.map((itemId) => itemId.toString())
  }
  return usersList;
}

async function addItemToUser(userId, itemId) {
  const userCollection = await users();
  let oldUser = getUserById(_id);

  let items = oldUser.items
  for (let item of items) {
    if (item.toString() = itemId.toString()) throw "addItemToUser: item already added to user"
  }
  items.push(ObjectId(itemId))

  const newUser = {
    name: oldUser.name,
    username: oldUser.username,
    passwordHash: oldUser.passwordHash,
    profilePicture: oldUser.profilePicture,
    emailAddress: oldUser.emailAddress,
    joinDate: oldUser.joinDate,
    items: items
  };

  const insertInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $set: newUser });
  if (insertInfo.insertedCount === 0) throw "createItem: Failed to update user";
  const id = insertInfo.insertedId.toString();
  return getUserById(id);
}

async function getUserById(id) {
  // ID Error Checking
  if (!id) throw "getUserById: Missing id";
  if (typeof id !== "string")
    throw "getUserById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getUserById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const userCollection = await users();
  const item = await itemsCollection.findOne({ _id: parsedId });
  if (item === null) throw `getItemById: Failed to find item with id '${id}'`;
  item._id = item._id.toString();
  item.sellerId = item.sellerId.toString();
  return item;
}

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  addItemToUser,
  getUserById
};
