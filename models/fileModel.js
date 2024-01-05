const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
    },
    mimetype: {
        type:String,
        required:true,
    },
    path: {
        type:String,
        required:true,
    },
    iv: {
        type:String,
        required:true,
    },
    encryptedSymmetricKey: {
        type:String,
        required:true,
    },
    size: Number,
})

const FileModel = mongoose.model('File', fileSchema);
module.exports = FileModel;