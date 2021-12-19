const upload = require('../middleware/upload')
const express = require('express');
const { GridFsStorage } = require('multer-gridfs-storage');
const router = express.Router();
const Grid = require('gridfs-stream')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const mongoConfig = require('../config/settings');
const e = require('express');

const url = process.env.DOCKER_MODE ? 'mongodb://mongo:27017/hobokenMarketDB' : 'mongodb://localhost:27017/hobokenMarketDB';

const bluebird = require('bluebird');
const redis = require('redis');
const redisOptions = {
  host: process.env.DOCKER_MODE ? 'redis' : 'localhost',
  port: 6379,
};
const client = redis.createClient(redisOptions);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const data = require('../data');




const conn = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

let gfs;

conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'images',
  }); // https://www.youtube.com/watch?v=OvbRLY1QRIk
});


// router.post("/upload", upload.single("file"), (req, res) =>{  
//   if (req.file === undefined) return res.json({error: "must select a file."})
//   console.log(req.body.sellerId)
//   console.log(req.file)
//   const imgUrl = `http://localhost:4000/file/${req.file.id}`;
//   return res.send(imgUrl);
// });

router.post("/profile_upload", upload.single("file"), async (req, res) =>{
  if (req.file === undefined) return res.json({error: "must select a file."})
  console.log(req.body.userId)
  console.log(req.file)
  try {
    let user = await data.users.getUserById(req.body.userId);
    let updatedUser = await data.users.updatePfp(req.body.userId, req.file.id)
    let userDataCached = await client.hsetAsync("user", `${req.body.userId}`, JSON.stringify(updatedUser));
    const imgUrl = `http://localhost:4000/file/${req.file.id}`;
    try {
      await data.images.deleteImage(user.profilePicture.toString())
    } catch (err) {
      console.log(err)
    }
    return res.json({imgUrl});
  } catch (e) {
    console.log(e)
    try {
      await data.images.deleteImage(req.file.id.toString());
      return res.status(500).json({error: e})
    } catch (err){
      console.log(err)
      return res.status(500).json({error: e})
    }
  }
})

router.get('/:id', async (req, res) => {
    let id = req.params.id
    if (!id || id.trim().length === 0) return res.status(400).json({error: "no id given"});
    const _id = new mongoose.Types.ObjectId(id);
    const files = await gfs.find({ _id }).toArray()
    if (!files || files.length === 0) return res.status(404).json({error: "file not found"});
    // console.log(files)
    gfs.openDownloadStream(_id).pipe(res);
  });

// async function deleteImage(id) {
//   if (!id || id.trim().length === 0) throw 'deleteImage: id not valid'
//   const imageId = new mongoose.Types.ObjectId(id)
//   const imageChunkCollection = await imageChunks()
//   const imageFileCollection = await imageFiles()
//   let chunkDelData = await imageChunkCollection.deleteMany({files_id:imageId});
//   let fileDelData = await imageFileCollection.deleteOne({_id:imageId});
//   console.log(chunkDelData)
//   console.log(fileDelData)
//   if (chunkDelData.deletedCount === 0 || fileDelData === 0) throw `deleteImage: images with id ${imageId} did not properly delete`
//   return;
// }

// router.delete('/:id', async (req, res) => {
//   try {
//     console.log(req.params.id)
//     await deleteImage(req.params.id)
//     res.json({deleted: true, id: req.params.id})
//   } catch (e) {
//     console.log(e)
//     res.status(500).json({error: {message: e, status: 500 }})
//   }
// })

module.exports = router;