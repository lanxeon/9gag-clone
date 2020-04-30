const mongoose = require('mongoose');

const commentVotesSchema = mongoose.Schema({
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true},
    voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }
});

module.exports = mongoose.model('CommentVote', commentVotesSchema);