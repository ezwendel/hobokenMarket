const { items, users } = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const saltRounds = 16;

function clean(obj) {
  obj._id = obj._id.toString();
  return obj;
}

async function createUser(body) {
  let name = body.name;
  let username = body.username;
  let password = body.password;
  let profilePicture = body.profilePicture;
  let emailAddress = body.emailAddress;
  let numbers = body.numbers;

  // Username Error Checking
  if (!username) throw "createUser: Missing username";
  if (typeof username !== "string")
    throw `createUser: username must be a string`;
  if (username.trim().length === 0)
    throw "createUser: username must not be an empty string";
  if (username.trim().length > 20)
    throw "createUser: username must not exceed 20 characters";

  // Name Error Checking
  if (!name) throw "createUser: Missing name";
  if (typeof name != "object") throw "createUser: name must be an object";
  if (!name.firstName) throw "createUser: Missing name.firstName";
  if (!name.lastName) throw "createUser: Missing name.lastName";
  if (typeof name.firstName !== "string")
    throw `createUser: name.firstName must be a string`;
  if (typeof name.lastName !== "string")
    throw `createUser: name.lastName must be a string`;
  if (name.firstName.trim().length === 0)
    throw "createUser: name.firstName must not be an empty string";
  if (name.lastName.trim().length === 0)
    throw "createUser: name.lastName must not be an empty string";

  // Password Error Checking
  if (!password) throw "createUser: Missing password";
  if (typeof password !== "string")
    throw `createUser: password must be a string`;
  if (password.trim().length === 0)
    throw "createUser: password must not be an empty string";
  if (password.trim().length > 20)
    throw "createUser: password must not exceed 20 characters";

  // Email Address Error Checking

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailAddress) throw "createUser: Missing emailAddress";
  if (typeof emailAddress !== "string")
    throw `createUser: emailAddress must be a string`;
  if (emailAddress.trim().length === 0)
    throw "createUser: emailAddress must not be an empty string";
  if (!emailRegex.test(emailAddress))
    throw "createUser: emailAddress is not a vaild emailAddress";

  // TODO: profilePicture error checking

  // Phone Error Checking
  const numberRegex = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  // numbers are optional, but should be of the correct form
  if (!numbers) throw "createUser: Missing numbers object";
  if (typeof numbers !== "object") throw "createUser: number must be an object";
  if (numbers.cell === undefined) {
    throw "createUser: Missing cell number; must be null or a string";
  } else {
    if (numbers.cell !== null) {
      if (typeof numbers.cell !== "string")
        throw `createUser: cell number must be a string`;
      if (numbers.cell.trim().length === 0)
        throw "createUser: cell number must not be an empty string";
      if (!numberRegex.test(numbers.cell))
        throw "createUser: cell number must be of the form XXX-XXX-XXXX";
    }
  }
  if (numbers.home === undefined) {
    throw "createUser: Missing home number; must be null or a string";
  } else {
    if (numbers.home !== null) {
      if (typeof numbers.home !== "string")
        throw `createUser: home number must be a string`;
      if (numbers.home.trim().length === 0)
        throw "createUser: home number must not be an empty string";
      if (!numberRegex.test(numbers.home))
        throw "createUser: home number must be of the form XXX-XXX-XXXX";
    }
  }

  const userCollection = await users();

  // Check if duplicate name from same seller
  let sameUsername = await userCollection
    .find({ username: username })
    .toArray();
  // console.log("username: ", username)
  // console.log("sameUsername: ", sameUsername)
  if (sameUsername.length != 0)
    throw `createUser: username "${username}" is taken`;

  // console.log("here")

  let passwordHash = await bcrypt.hash(password, saltRounds);

  // console.log("now here")

  const newUser = {
    name: name,
    username: username.trim(),
    passwordHash: passwordHash,
    profilePicture: null,
    emailAddress: emailAddress.trim(),
    joinDate: new Date(),
    items: [],
    messageIds: [],
    numbers: { cell: numbers.cell, home: numbers.home },
    ratings: [],
  };

  // console.log(newUser)

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "createUser: Failed to create user";
  const id = insertInfo.insertedId.toString();

  return await getUserById(id);
}

async function updateUser(body) {
  let _id = body._id;
  let name = body.name;
  let username = body.username.toLowerCase();
  let password = body.password;
  let profilePicture = body.profilePicture;
  let emailAddress = body.emailAddress.toLowerCase();
  let numbers = body.numbers;
  let joinDate = body.joinDate;
  let items = body.items;

  let oldUser = getUserById(_id);

  // Username Error Checking

  if (!username) {
    username = oldUser.username;
  }
  if (typeof username !== "string")
    throw `updateUser: username must be a string`;

  if (username.trim().length === 0)
    throw "updateUser: username must not be an empty string";
  if (username.trim().length > 20)
    throw "updateUser: username must not exceed 20 characters";

  // Name Error Checking

  if (!name) {
    name = oldUser.name;
  }
  if (typeof name != "object") throw "updateUser: name must be an object";
  if (!name.firstName) throw "updateUser: Missing name.firstName";
  if (!name.lastName) throw "updateUser: Missing name.lastName";
  if (typeof name.firstName !== "string")
    throw `updateUser: name.firstName must be a string`;
  if (typeof name.lastName !== "string")
    throw `updateUser: name.lastName must be a string`;

  if (name.firstName.trim().length === 0)
    throw "updateUser: name.firstName must not be an empty string";
  if (name.lastName.trim().length === 0)
    throw "updateUser: name.lastName must not be an empty string";

  // Password Error Checking
  let passwordHash = "";
  if (password) {
    if (typeof password !== "string")
      throw `updateUser: password must be a string`;
    if (password.trim().length === 0)
      throw "updateUser: password must not be an empty string";
    if (password.trim().length > 20)
      throw "updateUser: password must not exceed 20 characters";
    passwordHash = await bcrypt.hash(password, saltRounds);
  } else {
    passwordHash = oldUser.passwordHash;
  }

  // Email Address Error Checking

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailAddress) {
    emailAddress = oldUser.emailAddress;
  }
  if (typeof emailAddress !== "string")
    throw `updateUser: emailAddress must be a string`;

  if (emailAddress.trim().length === 0)
    throw "updateUser: emailAddress must not be an empty string";
  if (emailRegex.test(emailAddress))
    throw "updateUser: emailAddress is not a vaild emailAddress";

  // TODO: profilePicture error checking

  // Phone Error Checking
  const numberRegex = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  // numbers are optional, but should be of the correct form
  if (!numbers) throw "updateUser: Missing numbers object";
  if (typeof numbers !== "object") throw "updateUser: number must be an object";
  if (numbers.cell === undefined) {
    throw "updateUser: Missing cell number; must be null or a string";
  } else {
    if (numbers.cell !== null) {
      if (typeof numbers.cell !== "string")
        throw `updateUser: cell number must be a string`;
      if (numbers.cell.trim().length === 0)
        throw "updateUser: cell number must not be an empty string";
      if (!numberRegex.test(numbers.cell))
        throw "updateUser: cell number must be of the form XXX-XXX-XXXX";
    }
  }
  if (numbers.home === undefined) {
    throw "updateUser: Missing home number; must be null or a string";
  } else {
    if (numbers.home !== null) {
      if (typeof numbers.home !== "string")
        throw `updateUser: home number must be a string`;
      if (numbers.home.trim().length === 0)
        throw "updateUser: home number must not be an empty string";
      if (!numberRegex.test(numbers.home))
        throw "updateUser: home number must be of the form XXX-XXX-XXXX";
    }
  }

  const userCollection = await users();

  // Check if duplicate name from same seller
  // let sameUsername = userCollection.find({ username: username }).toArray();
  // if (sameUsername) throw `updateUser: username "${username}" is taken`;

  const newUser = {
    name: name.trim(),
    username: username.trim(),
    passwordHash: passwordHash,
    profilePicture: profilePicture,
    emailAddress: emailAddress.trim(),
    joinDate: oldUser.joinDate,
    numbers: { cell: numbers.cell, home: numbers.home },
    items: oldUser.items,
    ratings: oldUser.ratings
  };

  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(_id) },
    { $set: newUser }
  );
  if (updateInfo.modifiedCount === 0) throw "updateUser: Failed to update user";
  return await getUserById(_id);
}

async function getAllUsers() {
  const userCollection = await users();
  const usersList = await userCollection.find({}).toArray();
  if (usersList.length === 0) return [];
  for (let user of usersList) {
    user._id = user._id.toString();
    user.items = user.items.map((itemId) => itemId.toString());
  }
  return usersList;
}

async function addMessageThreadToUser(userId, messageId) {
  const userCollection = await users();

  let oldUser = await getUserById(userId);

  let messageIds = oldUser.messageIds
  messageIds.push(ObjectId(messageId))

  const newUser = {
    name: oldUser.name,
    username: oldUser.username,
    passwordHash: oldUser.passwordHash,
    profilePicture: oldUser.profilePicture,
    emailAddress: oldUser.emailAddress,
    joinDate: oldUser.joinDate,
    items: oldUser.items,
    messageIds: messageIds,
  };

  const updateInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $set: newUser });
  if (updateInfo.modifiedCount === 0) throw "createItem: Failed to update user";
  return getUserById(userId);

}

async function addItemToUser(userId, itemId) {
  if (!userId) throw "addItemToUser: Missing userId";
  if (typeof userId !== "string")
    throw `addItemToUser: userId must be a string`;

  if (!itemId) throw "addItemToUser: Missing itemId";
  if (typeof itemId !== "string")
    throw `addItemToUser: itemId must be a string`;

  const userCollection = await users();
  let oldUser = await getUserById(userId);

  oldUser.items = oldUser.items.map((x) => ObjectId(x));
  let items = oldUser.items;
  // console.log(items);
  for (let item of items) {
    if (item.toString() == itemId.toString())
      throw "addItemToUser: item already added to user";
  }
  items.push(ObjectId(itemId));

  const newUser = {
    name: oldUser.name,
    username: oldUser.username,
    passwordHash: oldUser.passwordHash,
    profilePicture: oldUser.profilePicture,
    emailAddress: oldUser.emailAddress,
    joinDate: oldUser.joinDate,
    numbers: oldUser.numbers,
    items: items,
    ratings: oldUser.ratings
  };

  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );
  if (updateInfo.modifiedCount === 0)
    throw "addItemToUser: Failed to update user";
  return getUserById(userId);
}
async function deleteItemToUser(userId, itemId) {
  if (!userId) throw "deleteItemToUser: Missing userId";
  if (typeof userId !== "string")
    throw `deleteItemToUser: userId must be a string`;

  if (!itemId) throw "deleteItemToUser: Missing itemId";
  if (typeof itemId !== "string")
    throw `deleteItemToUser: itemId must be a string`;

  const userCollection = await users();
  const flag=false;
  let oldUser = await getUserById(userId);

  oldUser.items = oldUser.items.map((x) => ObjectId(x));
  let items = oldUser.items
  // console.log(items);

  for (i=0;i<items.length; i++) {
    if (items[i].toString() == itemId.toString()){
      items.splice(i, 1);
    }
  }
  const newUser = {
    name: oldUser.name,
    username: oldUser.username,
    passwordHash: oldUser.passwordHash,
    profilePicture: oldUser.profilePicture,
    emailAddress: oldUser.emailAddress,
    joinDate: oldUser.joinDate,
    items: items,
    contacts: oldUser.contacts,
  };

  const updateInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $set: newUser });
  if (updateInfo.modifiedCount === 0) throw "deleteItemToUser: Failed to update user";
  return getUserById(userId);
}
async function updatePfp(userId, imageId) {
  if (!userId) throw "updatePfp: Missing userId";
  if (typeof userId !== "string")
    throw `updatePfp: userId must be a string`;

  if (!imageId) throw "updatePfp: Missing imageId";
  if (typeof imageId !== "string")
    throw `updatePfp: imageId must be a string`;

  const userCollection = await users();
  let oldUser = await getUserById(userId);

  const newUser = {
    name: oldUser.name,
    username: oldUser.username,
    passwordHash: oldUser.passwordHash,
    profilePicture: imageId,
    emailAddress: oldUser.emailAddress,
    joinDate: oldUser.joinDate,
    numbers: oldUser.numbers,
    items: oldUser.items,
    ratings: oldUser.ratings
  };

  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );
  if (updateInfo.modifiedCount === 0) throw "updatePfp: Failed to update user";
  return await getUserById(userId);
}

async function addRatingToUser(userId, raterId, rating) {
  if (!userId) throw "addRatingToUser: Missing userId";
  if (typeof userId !== "string")
    throw `addRatingToUser: userId must be a string`;

  if (!raterId) throw "addRatingToUser: Missing raterId";
  if (typeof raterId !== "string")
    throw `addRatingToUser: raterId must be a string`;

  if (rating === undefined) throw "addRatingToUser: Missing raterId";
  if (typeof rating !== "number")
    throw `addRatingToUser: rating must be a number`;
  if (rating < 0 || rating > 5) throw "addRatingToUser: rating must be between 0 and 5";

  const userCollection = await users();
  let oldUser = await getUserById(userId);
  let index = oldUser.ratings.findIndex((elem) => elem.raterId === raterId);
  // console.log(index);
  if (index === -1) {
    oldUser.ratings.push({ raterId: raterId, rating: rating });
  } else {
    oldUser.ratings[index] = { raterId: raterId, rating: rating };
  }
  const newUser = {
    name: oldUser.name,
    username: oldUser.username,
    passwordHash: oldUser.passwordHash,
    profilePicture: oldUser.profilePicture,
    emailAddress: oldUser.emailAddress,
    joinDate: oldUser.joinDate,
    numbers: oldUser.numbers,
    items: oldUser.items,
    ratings: oldUser.ratings
  };
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updateInfo.modifiedCount === 0) throw "addRatingToUser: Failed to update user";
  return getUserById(userId);
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
  const user = await userCollection.findOne({ _id: parsedId });
  if (user === null) throw `getUserById: Failed to find user with id '${id}'`;
  user._id = user._id.toString();
  user.items = user.items.map((x) => x.toString());
  return user;
}

async function getUserByEmail(email) {
  // ID Error Checking
  if (!email) throw "getUserByEmail: Missing email";
  if (typeof email !== "string")
    throw "getUserByEmail: The provided email must be a string";
  if (email.trim().length === 0)
    throw "getUserByEmail: The provided email must not be an empty string";

  const userCollection = await users();
  const user = await userCollection.findOne({ emailAddress: email });
  if (user === null)
    throw `getUserByEmail: Failed to find user with email '${email}'`;
  user._id = user._id.toString();
  user.items = user.items.map((x) => x.toString());
  return user;
}

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  addItemToUser,
  addMessageThreadToUser,
  getUserById,
  deleteItemToUser,
  getUserById,
  updatePfp,
  getUserByEmail,
  addRatingToUser
};
