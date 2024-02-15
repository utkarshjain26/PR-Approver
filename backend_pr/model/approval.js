const mongoose = require('mongoose');
const {Schema,model}=mongoose;

const approvalSchema = new Schema({
  pullRequestId: { type: Schema.Types.ObjectId, ref: 'PullRequest', required: true },
  approverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
},{
    timestamps:true,
});

const Approval = model('Approval', approvalSchema);

module.exports = Approval;
