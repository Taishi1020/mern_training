const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({storage});

// 画像のアップロードAPI
router.post('/', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json("画像アップロードされました。");
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;

