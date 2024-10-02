const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    approverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: false },
    readStatus: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "PullRequest",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
