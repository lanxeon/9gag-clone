const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, required: true },
    count: {
        upvotes: { type: Number, required: true },
        downvotes: { type: Number, required: true },
        replies: { type: Number, required: true },
    },
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post"},
    commenter: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model('Comment', commentSchema);