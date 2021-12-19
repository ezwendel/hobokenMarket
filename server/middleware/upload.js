const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const url = process.env.DOCKER_MODE ? 'mongodb://mongo:27017/hobokenMarketDB' : 'mongodb://localhost:27017/hobokenMarketDB';
const gm = require("gm"); //graphicsmagick
const fs = require("fs");
const path = require("path");

const storage = new GridFsStorage({
    url: url,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        let target = path.join(__dirname, `./../img/${file.originalname}`)
        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) { // https://www.youtube.com/watch?v=XCRUzPi0X0Q
            gm(file.path).resize(256, 256, "!").write(target, function(err){//resize the pictures before upload
                if(err){
                    console.log(err);
                    throw(err);
                }else{
                    try{
                        fs.unlink(target);
                    }catch(e){
                        throw e;
                    }
                }
            });
            const filename = `${Date.now()}-any-name-${file.originalname}`
            return filename;
        }

        return {
            bucketName: "images",
            filename: `${Date.now()}-any-name-${file.originalname}`
        }
    }
})

module.exports = multer({ storage })