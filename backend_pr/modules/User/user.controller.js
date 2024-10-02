const User = require("../../model/user");

const getUsers = async (req, res, next) => {
  try {
    const getUser = await User.find();
    // console.log('allusers',getUser);
    return res.status(200).json(getUser);
  } catch (err) {
    return next(err);
  }
};

const updateLastCheckTime = async (req, res, next) => {
  try {
    // console.log(req.body);
    const {lastCheckTime} = req.body;
    const { id } = req.params;
    console.log(lastCheckTime)
    const updatedDoc = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          lastCheckTime,
        },
      },
      { new: true }
    );
    return res.status(200).json(updatedDoc);
  } catch (err) {
    return next(err);
  }
};

exports.userController = {
  getUsers,
  updateLastCheckTime,
};
