const upload = require('../middleware/upload')
const express = require('express');
const { GridFsStorage } = require('multer-gridfs-storage');
const router = express.Router();
const { images } = require('../config/mongoCollections')
const Grid = require('gridfs-stream')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const mongoConfig = require('../config/settings');
const e = require('express');
const data = require('../data');
const url = 'mongodb://localhost:27017/hobokenMarketDB';

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

router.post("/upload", upload.single("file"), (req, res) =>{
    if (req.file === undefined) return res.send("must select a file.")
    console.log(req.body.sellerId)
    console.log(req.file)
    const imgUrl = `http://localhost:4000/file/${req.file.id}`;
    return res.send(imgUrl);
})

router.post("/profile_upload", upload.single("file"), async (req, res) =>{
  if (req.file === undefined) return res.send("must select a file.")
  console.log(req.body.userId)
  console.log(req.file)
  await data.users.updatePfp(req.body.userId, req.file.id)
  const imgUrl = `http://localhost:4000/file/${req.file.id}`;
  return res.send(imgUrl);
})

router.get('/:id', async (req, res) => {
    let id = req.params.id
    if (!id || id.trim().length === 0) return res.status(400).json({error: {message: "no id given", status: 400}});
    const _id = new mongoose.Types.ObjectId(id);
    const files = await gfs.find({ _id }).toArray()
    if (!files || files.length === 0) return res.status(404).json({error: {message: "file not found", status: 404}});
    console.log(files)
    gfs.openDownloadStream(_id).pipe(res);
  });

module.exports = router;