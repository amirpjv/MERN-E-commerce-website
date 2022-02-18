import path from 'path'
import express from 'express'
import multer from 'multer'
const uploadRouter = express.Router()
import { isAdmin, isAuth } from '../utils.js'

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        //console.log(file.fieldname) image
        //console.log(path.extname(file.originalname)) .jpg
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        )
    },
})

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    limits: {
        fieldNameSize: 300,
        fileSize: 10000000, // 10 Mb
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`);
})

export default uploadRouter
