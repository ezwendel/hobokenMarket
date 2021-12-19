const { items, users } = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const { imageChunks, imageFiles } = require('../config/mongoCollections')

async function deleteImage(id) {
  if (!id || typeof(id) != "string" || id.trim().length === 0) throw 'deleteImage: id not valid'
  const imageId = new ObjectId(id)
  const imageChunkCollection = await imageChunks()
  const imageFileCollection = await imageFiles()
  let chunkDelData = await imageChunkCollection.deleteMany({files_id:imageId});
  let fileDelData = await imageFileCollection.deleteOne({_id:imageId});
  console.log(chunkDelData)
  console.log(fileDelData)
  if (chunkDelData.deletedCount === 0 || fileDelData === 0) throw `deleteImage: images with id ${imageId} did not properly delete`
  return;
}

module.exports = {
  deleteImage
}