const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    contentPath: { type: String, required: true },
    contentType: {type: String, required: true, default: "image"},
    count: {
        upvotes: { type: Number, required: true },
        downvotes: { type: Number, required: true },
        comments: { type: Number, required: true },
    },
    poster: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true, default: "Funny" }
});

module.exports = mongoose.model('Post', postSchema);