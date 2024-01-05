const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'})
const fileController = require('../controllers/fileController')
router.post('/:username/upload', upload.array('files'),fileController.uploadFiles)
router.get('/:username/files', fileController.getFiles)
router.get('/:username/files/:file', fileController.getSingleFile)
module.exports = router


