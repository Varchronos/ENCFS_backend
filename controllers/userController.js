const { generateKeyPair, hashWithSalt } = require('../middlewares/CryptoUtils');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken')
const crypto = require('node:crypto');
require('dotenv').config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;

exports.register = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const { publicKey, privateKey } = generateKeyPair();

        //hashing the password
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = hashWithSalt(password, salt)

        const createdUser = await UserModel.create({
            username,
            password: hashedPassword,
            publicKey,
            privateKey,
            salt,
        });

        if (!createdUser) {
            return res.status(400).json({ error: 'Error creating user' });
        }

        // const token = jwt.sign({ userId: createdUser._id, username: createdUser.username}, jwt_secret_key, { expiresIn: '1h' });

        res.status(200).json({ message: 'Account successfully registered.', createdUser});
    } catch (error) {
        console.log(error, '<- error-code');
        if (error.code === 11000) return res.status(400).json({ error: 'username already exists' })
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).json({ message: 'user not found' });

        const hashedPayloadPassword = hashWithSalt(password, user.salt);
        if (hashedPayloadPassword !== user.password) return res.status(400).json({ message: 'password is incorrect' });

        const token = jwt.sign({ userId: user._id, username: user.username}, jwt_secret_key, { expiresIn: '1h' });


        res.status(200).json({ message: 'successful login', token });
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
}
