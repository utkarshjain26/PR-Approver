const mongoose = require('mongoose');
const {Schema,model}=mongoose;

const reviewSchema = new Schema({
  pullRequestId: { type: Schema.Types.ObjectId, ref: 'PullRequest', required: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: { type: String }},
  {
    timestamps:true,
  }
);

const Review = model('Review', reviewSchema);

module.exports = Review;
