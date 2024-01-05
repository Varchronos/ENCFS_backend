const crypto = require('node:crypto');
const {generateKeyPair, encryptWithPublicKey, decryptWithPrivateKey} = require('./middlewares/CryptoUtils')


let array = [1,2,3,4,5,6,7]
let arrayBuffer = Buffer.from(array);
console.log(arrayBuffer);
const iv = crypto.randomBytes(16);
const symmetricKey = crypto.randomBytes(32);
console.log('symmetricKey', symmetricKey)

//rsa enc and dec
// const {publicKey, privateKey} = generateKeyPair();
// let encryptedSymmetricKey = crypto.publicEncrypt(publicKey, symmetricKey);
// encryptedSymmetricKey = encryptedSymmetricKey.toString('base64');
// console.log('encrypted',encryptedSymmetricKey)
// const decryptedKey = crypto.privateDecrypt(privateKey,Buffer.from(encryptedSymmetricKey, 'base64'));
// console.log(decryptedKey);


//symmetric enc and dec
// const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
// const encrypted = Buffer.concat([cipher.update(arrayBuffer,'utf-8'), cipher.final()]);
// console.log('encrypted_data',encrypted);
// const decipher = crypto.createDecipheriv('aes-256-cbc',symmetricKey, iv);
// const decryptedData = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64')), decipher.final()]);
// console.log('decrypted_data', decryptedData);



