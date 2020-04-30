const mongoose = require('mongoose');

const postVotesSchema = mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true},
    voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }
});

module.exports = mongoose.model('PostVote', postVotesSchema);