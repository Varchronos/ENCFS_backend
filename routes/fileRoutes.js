const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'})
const {authToken} = require('../middlewares/auth/auth.middleware')
const fileController = require('../controllers/fileController')
router.post('/files/upload',authToken, upload.array('files'),fileController.uploadFiles)
router.get('/files',authToken, fileController.getFiles)
router.get('/files/:file',authToken, fileController.getSingleFile)
module.exports = router


