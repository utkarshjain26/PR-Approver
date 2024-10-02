const Notification = require("../../model/notification");
const User = require("../../model/user");

const getNotifications = async (req, res, next) => {
  try {
    // console.log("user interface", req.user);
    const getNotification = await Notification.find({
      approverId: req.user._id,
    }).sort({ createdAt: -1 });
    // console.log("all notifications", getNotification);
    return res.status(200).json(getNotification);
  } catch (err) {
    return next(err);
  }
};

const getNewNotification=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const userDoc=await User.findById(id);
    const getNewNotifications=await Notification.find({
      approverId:id,
      createdAt: {$gt:userDoc.lastCheckTime}
    });
    return res.status(200).json(getNewNotifications);
  }catch(err){
    return next(err);
  }
}

const updateNotificationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getNotificationById = await Notification.findByIdAndUpdate(
      id ,
      { readStatus: true },
      { new: true }
    );
    return res.status(200).json(getNotificationById);
  } catch (err) {
    return next(err);
  }
};

exports.notificationController = {
  getNotifications,
  getNewNotification,
  updateNotificationStatus,
};
