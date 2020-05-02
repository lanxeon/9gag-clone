const express = require('express');

const auth = require('../middleware/auth');
const authRequired = require('../middleware/authRequired');

const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const CommentVote = require('../models/commentVoteModel');

const router = express.Router();



//for posting a comment
router.post('', auth, authRequired,(req, res, next) => { 
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
    let jsonBody;

    comment.save().then(result => {
        jsonBody = {
            message: "sent the shiz nigga",
            comment: result
        };
        return Comment.populate(result, [{path: 'post'}]);
    })
    .then(populatedFields => {
        console.log(populatedFields);
        const currentCommentCount = populatedFields.post.count.comments;
        return Post.findOneAndUpdate({_id: req.body.postId}, {"count.comments": currentCommentCount + 1});
    })
    .then(result => {
            res.status(201).json(jsonBody);
        })
        .catch(err => {
        res.status(500).json({
            message: "failed nigga",
            error: err
        });
    });
});




//for getting all the comments of a specific post
router.get('/:postId', auth, (req, res, next) => 
{
    let query = Comment.find({post: req.params.postId});
    let queryData;
    
    query.then(result =>
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
});



//for upvoting a comment
router.post('/upvote/:commentId', auth, authRequired, (req, res, next) => {
    CommentVote.find({ comment: req.params.commentId, voter: req.userData.userId }).findOne()
        .populate("comment").then(result => {
            if(result)
                {
                    const currentUpvoteCount = result.comment.count.upvotes;
                    const currentDownvoteCount = result.comment.count.downvotes;
                    const type = result.type;
                    if(type === "downvote")
                        {
                            CommentVote.findOneAndUpdate({_id: result._id}, { type: "upvote" }).then(result =>
                                {
                                    return Comment.findOneAndUpdate({_id: req.params.commentId}, 
                                        {"count.upvotes": currentUpvoteCount + 1, "count.downvotes": currentDownvoteCount - 1 });
                                    }).then(result => {
                                            return res.status(201).json({message: "downvote converted to upvote"});
                                        });
                        }
                        
                        else 
                        {
                            CommentVote.findOneAndDelete({_id: result._id}).then( result =>
                                {
                                    return Comment.findOneAndUpdate({_id: req.params.commentId}, 
                                        {"count.upvotes": currentUpvoteCount - 1});
                                    }).then(result => {
                                            return res.status(201).json({message: "un-upvoted"});
                                        });
                        }
                    return;
                }
                
            const upvote = new CommentVote({
                comment: req.params.commentId,
                voter: req.userData.userId,
                type: "upvote" 
            });
            upvote.save()
            .then(result => {
                return Comment.findOne({_id: req.params.commentId})
            }).then(result => {
                const currentUpvoteCount = result.count.upvotes;
                return Comment.findOneAndUpdate({_id: result._id}, {"count.upvotes": currentUpvoteCount + 1})
            }).then(result => {
                res.status(201).json({
                    message: "upvoted!"
                });
            });
        });
});



//for downvoting a post
router.post('/downvote/:commentId', auth, authRequired, (req, res, next) => {
    CommentVote.find({ comment: req.params.commentId, voter: req.userData.userId }).findOne()
        .populate("comment").then(result => {
            if(result)
                {
                    const currentUpvoteCount = result.comment.count.upvotes;
                    const currentDownvoteCount = result.comment.count.downvotes;
                    const type = result.type;
                    if(type === "upvote")
                        {
                            CommentVote.findOneAndUpdate({_id: result._id}, { type: "downvote" }).then(result =>
                                {
                                    return Comment.findOneAndUpdate({_id: req.params.commentId}, 
                                        {"count.upvotes": currentUpvoteCount - 1, "count.downvotes": currentDownvoteCount + 1 });
                                    }).then(result => {
                                            return res.status(201).json({message: "upvote converted to downvote"});
                                        });
                        }
                        
                        else 
                        {
                            CommentVote.findOneAndDelete({_id: result._id}).then( result =>
                                {
                                    return Comment.findOneAndUpdate({_id: req.params.commentId}, 
                                        {"count.downvotes": currentDownvoteCount - 1});
                                    }).then(result => {
                                            return res.status(201).json({message: "un-downvoted"});
                                        });
                        }
                    return;
                }
                
            const downvote = new CommentVote({
                comment: req.params.commentId,
                voter: req.userData.userId,
                type: "downvote" 
            });
            downvote.save()
            .then(result => {
                return Comment.findOne({_id: req.params.commentId})
            }).then(result => {
                const currentDownvoteCount = result.count.downvotes;
                return Comment.findOneAndUpdate({_id: result._id}, {"count.downvotes": currentDownvoteCount + 1})
            }).then(result => {
                res.status(201).json({
                    message: "downvoted"
                });
            });
        });
});

module.exports = router;