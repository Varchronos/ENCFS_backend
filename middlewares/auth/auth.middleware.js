require('dotenv').config();
const jwt = require('jsonwebtoken')
const jwt_secret_key = process.env.JWT_SECRET_KEY;

exports.authToken = (req, res, next)=>{
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'unauthorized' });
    }
    jwt.verify(token, jwt_secret_key,(err, user)=>{
        if(err){
            return res.status(401).json({ message: 'Timed out!' })
        }
        req.user = user
        next();
    })
}