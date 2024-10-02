const User = require("../../model/user");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      throw new Error("User already exists");
    }
    
    const hshpwd = bcrypt.hashSync(password,10); // salt_round=10;

    const newUser = await User.create({ username, email, password: hshpwd });
    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username });
    if (!findUser) {
      throw new Error("User not found");
    }
    const passcheck = await bcrypt.compare(`${password}`, findUser.password);
    if (!passcheck) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ username, id: findUser._id }, process.env.JWT_SECRET, {});
    const userCredentials = {
      user: {
        userId: findUser._id,
        userName: findUser.username,
        userEmail: findUser.email,
      },
      token,
    };
    return res.status(200).json(userCredentials);
  } catch (err) {
    return next(err);
  }
};

exports.authContoller = {
  signUp,
  login,
};
