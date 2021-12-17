const { items, users } = require("../config/mongoCollections");
const moment = require("moment"); // for date checking
const { ObjectId } = require("mongodb");

// https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
function containsDuplicates(arr) {
  return (new Set(arr)).size !==  arr.length;
}

async function createItem(body) {
  let name = body.name;
  let description = body.description;
  let sellerId = body.sellerId;
  let itemPictures = body.itemPictures;
  let categories = body.categories;

  // Name Error Checking
  if (!name) throw "createItem: Missing name";
  if (typeof name !== "string") throw `createItem: name must be a string`;
  if (name.trim().length === 0)
    throw "createItem: name must not be an empty string";
  if (name.trim().length >= 25)
    throw "createItem: name must not exceed 20 characters";

  // Description Error Checking
  if (!description) throw "createItem: Missing description";
  if (typeof description !== "string")
    throw `createItem: description must be a string`;
  if (description.trim().length === 0)
    throw "createItem: description must not be an empty string";

  // Seller ID Error Checking
  if (!sellerId) throw "createItem: Missing sellerId";
  if (typeof sellerId !== "string")
    throw `createItem: sellerId must be a string`;
  if (sellerId.trim().length === 0)
    throw "createItem: sellerId must not be an empty string";

  // TODO: Item Pictures error checking

  // Categories Error Checking
  if (!categories) throw "createItem: Missing categories";
  if (!Array.isArray(categories))
    throw `createItem: categories must be an array`;
  // if (categories.length === 0) throw "createItem: categories cannot be empty";
  let categoriesTrim = [];
  for (const category of categories) {
    if (typeof category !== "string")
      throw `createItem: Each category must be a non-empty string`;
    if (category.trim().length === 0)
      throw "createItem: Each category must be a string";
    categoriesTrim.push(category.trim());
  }
  // Check if categories has duplicates
  if (containsDuplicates(categories)) throw `createItem: Each category must be unique`;

  const itemsCollection = await items();

  // Check if duplicate name from same seller
  itemsCollection.find({
    $and: [{ name: name }, { sellerId: ObjectId(sellerId.trim()) }],
  });

  const newItem = {
    name: name.trim(),
    description: description.trim(),
    sellerId: ObjectId(sellerId.trim()),
    itemPictures: itemPictures,
    listDate: new Date(),
    categories: categories,
  };

  const insertInfo = await itemsCollection.insertOne(newItem);
  if (insertInfo.insertedCount === 0) throw "createItem: Failed to create item";
  const id = insertInfo.insertedId.toString();
  return getItemById(id);
}

async function getAllItems() {
  const itemsCollection = await items();
  const itemsList = await itemsCollection.find({}).toArray();
  if (itemsList.length === 0) return [];
  for (let item of itemsList) {
    item._id = item._id.toString();
    item.sellerId = item.sellerId.toString();
  }
  return itemsList;
}

async function getItemById(id) {
  // ID Error Checking
  if (!id) throw "getItemById: Missing id";
  if (typeof id !== "string")
    throw "getItemById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "getItemById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const itemsCollection = await items();
  const item = await itemsCollection.findOne({ _id: parsedId });
  if (item === null) throw `getItemById: Failed to find item with id '${id}'`;
  item._id = item._id.toString();
  item.sellerId = item.sellerId.toString();
  return item;
}

async function deleteItemById(id) {
  if (!id) throw "deleteItemById: Missing id";
  if (typeof id !== "string")
    throw "deleteItemById: The provided id must be a string";
  if (id.trim().length === 0)
    throw "deleteItemById: The provided id must not be an empty string";
  const parsedId = ObjectId(id.trim());

  const itemCollection = await items();
  const deletionInfo = await itemCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) {
    throw "deleteItemById: Failed to delete item";
  }
  return { deleted: true };
}

async function getItemsByCategory(category) {
  if (!category) throw "getItemsByCategory: Missing category";
  if (typeof category !== "string")
    throw "getItemsByCategory: The provided category must be a string";
  if (category.trim().length === 0)
    throw "getItemsByCategory: The provided category must not be an empty string";

  const itemCollection = await items();
  // const itemsList = await itemCollection.find({ categories: category }).toArray();
  await itemCollection.createIndex( { categories: "text"} ) // case insensitive
  const itemsList = await itemCollection.find({ $text: { $search: category } }).toArray();
  await itemCollection.dropIndexes()
  // itemsList.reverse() // this makes oldest first
  for (let item of itemsList) {
    item._id = item._id.toString();
    item.sellerId = item.sellerId.toString();
  }
  return itemsList;
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

async function search(keyword) {
  if (!keyword) throw "search: Missing keyword";
  if (typeof keyword !== "string")
    throw "search: The provided keyword must be a string";
  if (keyword.trim().length === 0)
    throw "search: The provided keyword must not be an empty string";

  const itemCollection = await items();
  await itemCollection.createIndex( {name: "text", description: "text", categories: "text"} )
  let itemsList = await itemCollection.find( { $text: { $search: keyword } } ).toArray()
  await itemCollection.dropIndexes()
  for (let item of itemsList) {
    item._id = item._id.toString();
    item.sellerId = item.sellerId.toString();
  }
  return itemsList;
}



module.exports = {
  createItem,
  getAllItems,
  getItemById,
  deleteItemById,
  getItemsByCategory,
  getItemsBySeller,
  search
};
