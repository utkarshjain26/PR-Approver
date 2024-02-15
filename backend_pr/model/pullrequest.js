const mongoose = require('mongoose');
const {Schema,model}=mongoose;

const pullRequestSchema = new Schema({
  title: { type: String },
  description: { type: String },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments:[{type: Schema.Types.ObjectId, ref:'Review'}],
  approvals:[{type: Schema.Types.ObjectId, ref:'Approval'}],
  approvers: [
    {
      approverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    }
  ],
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }},
  {
    timestamps:true,
  }
);

const PullRequest = model('PullRequest', pullRequestSchema);

module.exports = PullRequest;
