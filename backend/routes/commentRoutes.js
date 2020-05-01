const express = require('express');
const auth = require('../middleware/auth');
const Comment = require('../models/commentModel');

const router = express.Router();

router.post('/create', auth, (req, res, next) => {
    
    const comment = new Comment({
        content: req.body.content,
        count: {
            upvotes: 0,
            downvotes: 0,
            replies: 0,
        },
        post: req.body.postId,
        commenterId: req.userData.userId,
        commenterUsername: req.userData.username
    });

    comment.save().then(result => {
        res.status(201).json({
            message: "sent the shiz nigga",
            comment: result
        });
    }).catch(err => {
        res.status(500).json({
            message: "failed nigga",
            error: err
        });
    });
});


module.exports = router;