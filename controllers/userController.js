const { generateKeyPair, encryptWithPublicKey } = require('../middlewares/CryptoUtils');
const UserModel = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const { publicKey, privateKey } = generateKeyPair();

        const createdUser = await UserModel.create({
            username,
            password,
            publicKey,
            privateKey,
        });

        if (!createdUser) {
            return res.status(400).json({ error: 'Error creating user' });
        }

        res.status(200).json({ message: 'Account successfully registered.', createdUser });
    } catch (error) {
        console.log(error.code, '<- error-code');
        if(error.code === 11000)return res.status(400).json({error:'username already exists'})
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
