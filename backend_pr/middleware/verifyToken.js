const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      throw new Error("Token not found"); //401 unauthorized error
    }
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });
    const userDoc=await User.findById(decodedInfo.id);
    if(!userDoc){
        throw new Error('User not found') //404 error
    }
    req.user=userDoc;
    return next();
  } catch (err) {
    return next(err);
  }
};
