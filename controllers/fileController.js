const fs = require('fs');
const crypto = require('crypto');
const FileModel = require('../models/fileModel');
const UserModel = require('../models/userModel')
const { encryptWithPublicKey, encryptWithSymmetricKey, decryptWithPrivateKey, decryptWithSymmetricKey } = require('../middlewares/CryptoUtils');
const jwt = require('jsonwebtoken');
const jwt_secret_key = process.env.JWT_SECRET_KEY;


exports.uploadFiles = async (req, res) => {
    try {
        const files = req.files;

        //extracting username from current session
        let username = '';
        token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, jwt_secret_key, (err, decoded) => {
            if (err) return res.status(404).json({ message: 'token verification failed' })
            username = decoded.username;
        })

        //finding if the user exists and then extracting the user's public key
        const currentUser = await UserModel.findOne({ username: username })
        if (!currentUser) return res.status(404).json({ message: 'could not find user' });
        const publicKey = currentUser.publicKey;

        //traverse multiple files (if any)
        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            //generate symmetric key for aes encryption
            const symmetricKey = crypto.randomBytes(32)

            //encrypt the file
            const fileContent = fs.readFileSync(file.path)
            console.log('encryption--------------------------------');
            const encryptedFileWithIV = encryptWithSymmetricKey(fileContent, symmetricKey);
            const encryptedFilePath = `${file.destination}encrypted_${file.filename}`
            fs.writeFileSync(encryptedFilePath, encryptedFileWithIV.encryptedData);


            //encrypt the symmetric key with user's public key.
            const encryptedSymmetrickey = encryptWithPublicKey(symmetricKey, publicKey);

            //save the metadata of file in database
            const newFile = new FileModel({
                username: username,
                name: file.originalname,
                path: encryptedFilePath,
                size: fileContent.length,
                mimetype: file.mimetype,
                iv: encryptedFileWithIV.iv,
                encryptedSymmetricKey: encryptedSymmetrickey,
            })
            await newFile.save();

            //delete the original file that was created by multer
            // deleteStatus only returns err callback if received else nothing returned.
            const deleteStatus = await fs.rm(file.path, (err) => err);
            if (deleteStatus) return res.status(500).json('file Controller, Internal server error')
        }
        console.log(`file/s were encrypted and uploaded by ${username}`);
        res.status(200).json({
            message: `Files uploaded and encrypted successfully by ${username}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};


exports.getFiles = async (req, res, next) => {
    try {

        //extracting username from current session
        let username = '';
        token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, jwt_secret_key, (err, decoded) => {
            if (err) return res.status(404).json({ message: 'token verification failed' })
            username = decoded.username;
        })

        //checking if user exists
        const user = await UserModel.findOne({ username })
        if (!user) return res.status(404).json({ message: 'user not found' })

        //searching for files for user
        const files = await FileModel.find({ username: username });

        const fileDetails = files.map(file => ({
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            uploadedBy: file.username
        }))
        // console.log(files);
        res.status(200).json(fileDetails);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getSingleFile = async (req, res) => {
    try {
        //getting req parameters from dynamic routes
        const username = req.params.username;
        const filename = req.params.file;

        //getting current user to extract public and private keys
        const currentUser = await UserModel.findOne({ username: username })
        if (!currentUser) return res.status(404).json({ message: 'could not find user' });
        const privateKey = currentUser.privateKey;

        //getting the current file meta from DB that is the same as the file route parameter
        const currentFile = await FileModel.findOne({ path: { $eq: `uploads/encrypted_${filename}` } }).lean();

        if (!currentFile) {
            return res.status(404).json({ message: 'File not found' });
        }


        console.log('decryption--------------------------------')
        //extracting the encrypted symmetric key of the current file and decrypting it
        const encryptedSymmetricKey = currentFile.encryptedSymmetricKey;
        const decryptedSymmetricKey = decryptWithPrivateKey(encryptedSymmetricKey, privateKey);


        //decrypting the file content using the symmetric key and iv extracted from the current FileModel entry.
        const fileContent = fs.readFileSync(currentFile.path);
        const decryptedFileContent = decryptWithSymmetricKey(fileContent, decryptedSymmetricKey, currentFile.iv);


        const fileName = currentFile.name;
        //setting the name and contentType of the response and finally sending the response which contains the raw file.
        res.attachment(fileName)
        res.contentType(currentFile.mimetype);
        res.status(200).send(decryptedFileContent);
        // res.contentType(currentFile.mimetype).attachment(filename).status(200).send(decryptedFileContent);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: '/username/files/file Internal server error' });
    }
}
