const crypto = require('node:crypto')

exports.generateKeyPair = () => {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  })
}


exports.encryptWithPublicKey = (data, publicKey) => {
  const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
  return encryptedData.toString('base64');
}

exports.decryptWithPrivateKey = (encryptedData, privateKey) => {
  const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
  return decryptedData;
}

exports.encryptWithSymmetricKey = (data, symmetricKey) => {
  console.log('symmetric key: ', symmetricKey);
  const iv = crypto.randomBytes(16); // Initialization vector
  console.log('iv: ', iv);
  const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted};
}


exports.decryptWithSymmetricKey = (encryptedData, symmetricKey, iv) => {
  console.log('decrypted symmetric key:', symmetricKey);
  console.log('iv: ',Buffer.from(iv,'hex'));
const decipher = crypto.createDecipheriv('aes-256-cbc',symmetricKey, Buffer.from(iv,'hex'));
const decryptedData = Buffer.concat([decipher.update(Buffer.from(encryptedData)), decipher.final()]);
return decryptedData;
}


// exports.hashPublicKey = (data)=>{
//   const hash = crypto.createHash('sha256').update(data).digest('hex');
//   const shortenedKey = hash.slice(0,16);
//   return shortenedKey;
// }

exports.hashWithSalt = (data, salt)=>{
  const hash = crypto.createHash('sha256');
  hash.update(data+salt);
  return hash.digest('hex');
}
