const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const url = process.env.DOCKER_MODE ? 'mongodb://mongo:27017/hobokenMarketDB' : 'mongodb://localhost:27017/hobokenMarketDB';

const storage = new GridFsStorage({
    url: url,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) { // https://www.youtube.com/watch?v=XCRUzPi0X0Q
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