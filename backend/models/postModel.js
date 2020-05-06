const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    contentPath: { type: String, required: true },
    count: {
        upvotes: { type: Number, required: true },
        downvotes: { type: Number, required: true },
        comments: { type: Number, required: true },
    },
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    posterUsn: { type: String, required: true },
    category: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);