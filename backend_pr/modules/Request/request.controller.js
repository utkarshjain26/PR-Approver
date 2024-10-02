const PullRequest = require("../../model/pullrequest");
const Notification = require("../../model/notification");
const { services } = require("../../services/services");
const Review = require("../../model/review");
const Approval = require("../../model/approval");
const { isUserOnline, sendNotificationToUser } = require('../../socket/socketHandler');

const getRequests = async (req, res, next) => {
  try {
    const requestDoc = await PullRequest.find()
      .populate("requesterId", ["username"])
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json(requestDoc);
  } catch (err) {
    return next(err);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postDoc = await PullRequest.findById(id)
      .populate("requesterId", ["username"])
      .populate({
        path: "approvers.approverId", // Adjust the path based on your schema
        model: "User",
        select: "username email", // Specify the fields you want to select from the User model
      })
      .populate({
        path: "comments",
        model: "Review",
        populate: {
          path: "reviewerId",
          model: "User",
          select: "username",
        },
      })
      .populate({
        path: "approvals",
        model: "Approval",
        populate: {
          path: "approverId",
          model: "User",
          select: "username",
        },
      });
    res.json(postDoc);
  } catch (err) {
    return next(err);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const { title, content, processed, checker } = req.body;
    const info = req.user;

    const approversArray = await services.getApproversAndRequesters(checker);

    console.log("users at controller", approversArray);

    if (title) {
      const requestDoc = await PullRequest.create({
        title,
        description: content,
        requesterId: info._id,
        comments: [],
        approvals: [],
        processed,
        approvers: approversArray,
      });

      if (processed === "parallel") {
        const createNotificationsForRequest = async (checker) => {
          for (let i = 0; i < checker.length; ++i) {
            if (isUserOnline(checker[i])) {
              sendNotificationToUser(checker[i], `Review a request with title ${title}`);
            }
            await services.createNotification({
              approverId: checker[i],
              requestDoc: requestDoc,
              user: req.user,
            });
          }
        };
        createNotificationsForRequest(checker);
      } else if (processed === "sequential") {
        const createNotificationsForRequest = async (checker) => {
          if (isUserOnline(checker[requestDoc.counter])) {
            sendNotificationToUser(checker[requestDoc.counter], `Review a request with title ${title}`);
          }
          await services.createNotification({
            approverId: checker[requestDoc.counter],
            requestDoc: requestDoc,
            user: req.user,
          });
        };
        createNotificationsForRequest(checker);
      }

      return res.json(requestDoc);
    } else {
      res.status(400).json("Title is required");
    }
  } catch (err) {
    return next(err);
  }
};

const deleteRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const info = req.user;
    const postDoc = await PullRequest.findById(id);
    const isAuthor =
      JSON.stringify(info.id) === JSON.stringify(postDoc.requesterId);

    await Review.deleteMany({ _id: { $in: postDoc.comments } });
    await Approval.deleteMany({ _id: { $in: postDoc.approvals } });
    await Notification.deleteMany({ requestId: id });
    await PullRequest.deleteOne({ _id: id });
    return res.status(200).json("ok");
  } catch (err) {
    return next(err);
  }
};

const updateRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const info = req.user;
    const postDoc = await PullRequest.findById(id);
    const isAuthor =
      JSON.stringify(info.id) === JSON.stringify(postDoc.requesterId);
    if (!isAuthor) {
      return res.status(400).send("not valid user");
    }
    await postDoc.updateOne({
      $set: {
        title,
        description: content,
        requesterId: info.id,
        comments: postDoc.comments,
        approvers: postDoc.approvers,
        approvals: postDoc.approvals,
        status: postDoc.status,
      },
    });
    return res.json(postDoc);
  } catch (err) {
    return next(err);
  }
};

const postCommentToRequestById = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const { id } = req.params;
    const info = req.user;

    const postDoc = await PullRequest.findById(id);
    const newComment = await Review.create({
      pullRequestId: id,
      reviewerId: info.id,
      comments: comment,
    });
    postDoc.comments.push(newComment);
    await postDoc.save();
    return res.status(200).json(newComment);
  } catch (err) {
    return next(err);
  }
};

const postApprovalToRequestById = async (req, res, next) => {
  try {
    const { approval } = req.body;
    const { id } = req.params;
    const postDoc = await PullRequest.findById(id);

    if (!postDoc) {
      throw new Error(`Request not found with id ${id}`);
    }

    const newApproval = await Approval.create({
      pullRequestId: id,
      approverId: req.user._id,
      counter: postDoc.counter++,
      status: approval,
    });
    postDoc.approvals.push(newApproval);
    await postDoc.save();

    if (approval === "Approved") {
      postDoc.approvers.forEach((approver) => {
        if (
          JSON.stringify(req.user._id) === JSON.stringify(approver.approverId)
        ) {
          approver.status = "Approved";
          if (postDoc.processed === "sequential") {
            if (isUserOnline(postDoc.approvers[postDoc.counter]?.approverId)) {
              sendNotificationToUser(postDoc.approvers[postDoc.counter]?.approverId, `Review a request with title ${postDoc.title}`);
            }
            services.createNotification({
              approverId: postDoc.approvers[postDoc.counter]?.approverId,
              requestDoc: postDoc,
              user: req.user,
            });
          }
        }
      });

      let flag = false;
      postDoc.approvers.forEach((approver) => {
        if (approver.status === "Pending") {
          flag = true;
        }
      });
      if (flag == false) {
        postDoc.status = "Approved";
      }
      postDoc.save();
    }

    if (approval === "Rejected") {
      postDoc.approvers.forEach((approver) => {
        if (JSON.stringify(req.user._id) === JSON.stringify(approver.approverId)) {
          approver.status = "Rejected";
        }
      });

      postDoc.status = "Rejected";
      postDoc.save();
    }

    res.status(200).json(newApproval);
  } catch (err) {
    return next(err);
  }
};

exports.requestController = {
  getRequests,
  getRequestById,
  createRequest,
  deleteRequestById,
  updateRequestById,
  postCommentToRequestById,
  postApprovalToRequestById,
};
