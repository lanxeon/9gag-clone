const express = require('express');
const auth = require('../middleware/auth');
const Comment = require('../models/commentModel');

const router = express.Router();


//for posting a comment
router.post('', auth, (req, res, next) => { 
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


//for getting comments of a specific post
router.get('/:postId', (req, res, next) => 
{
    Comment.find({post: req.params.postId}).then(result =>
        {
            res.status(200).json({
                message: "comments fetched successfully",
                comments: result
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    // res.status(200).json({});
})


module.exports = router;