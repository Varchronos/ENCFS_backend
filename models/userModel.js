
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    publicKey:{type:String, required:true},
    privateKey:{type:String, required:true},
})

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;