const express = require("express");

const auth = require("../middleware/auth");
const authRequired = require("../middleware/authRequired");

const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const CommentVote = require("../models/commentVoteModel");

const router = express.Router();

//for posting a comment
router.post("", auth, authRequired, (req, res, next) => {
  const comment = new Comment({
    content: req.body.content,
    count: {
      upvotes: 0,
      downvotes: 0,
      replies: 0,
    },
    post: req.body.postId,
    commenter: req.userData.userId
  });
  let jsonBody;

  comment
    .save()
    .then((result) => {
      jsonBody = {
        message: "Comment Posted Successfully ",
        comment: result
      };
      return Comment.populate(result, [{ path: "post" }]);
    })
    .then((populatedFields) => {
      // console.log(populatedFields);
      const currentCommentCount = populatedFields.post.count.comments;
      return Post.findOneAndUpdate(
        { _id: req.body.postId },
        { "count.comments": currentCommentCount + 1 }
      );
    })
    .then((result) => {
      res.status(201).json(jsonBody);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Posting Comment Failed",
        error: err
      });
    });
});

//for getting all the comments of a specific post
router.get("/:postId", auth, (req, res, next) => {
  let query = Comment.find({ post: req.params.postId }).populate('commenter', '_id username dp');
  let queryData;

  if (!req.isAuthenticated) {
    query
      .then((result) => {
        // console.log(result);
        res.status(200).json({
          message: "comments fetched successfully",
          comments: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
    return;
  }

  query
    .lean()
    .then((result) => {
      queryData = result;
      let commentIds = queryData.map((comment) => comment._id);
      return CommentVote.find({
        voter: req.userData.userId,
        comment: { $in: commentIds },
      }).lean();
    })
    .then((result) => {
      if (result) {
        let storedRes = result;
        storedRes.forEach((obj) => {
          specComment = queryData.find((comment) =>
            comment._id.equals(obj.comment)
          );
          // console.log(specComment);
          if (specComment) {
            index = queryData.indexOf(specComment);
            queryData[index].voteStatus =
              obj.type == "upvote" ? "upvoted" : "downvoted";
          }
        });
      }
      res.status(200).json({
        message: "comments fetched successfully",
        comments: queryData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  return;
});

//for upvoting a comment
router.post("/upvote/:commentId", auth, authRequired, (req, res, next) => {
  CommentVote.find({
    comment: req.params.commentId,
    voter: req.userData.userId,
  })
    .findOne()
    .populate("comment")
    .then((result) => {
      if (result) 
      {
        const currentUpvoteCount = result.comment.count.upvotes;
        const currentDownvoteCount = result.comment.count.downvotes;
        const type = result.type;
        if (type === "downvote") {
          CommentVote.findOneAndUpdate({ _id: result._id }, { type: "upvote" })
            .then((result) => {
              return Comment.findOneAndUpdate(
                { _id: req.params.commentId },
                {
                  "count.upvotes": currentUpvoteCount + 1,
                  "count.downvotes": currentDownvoteCount - 1,
                }
              );
            })
            .then((result) => {
              return res
                .status(201)
                .json({ message: "downvote converted to upvote" });
            });
        } 
        
        else 
        {
          CommentVote.findOneAndDelete({ _id: result._id })
            .then((result) => {
              return Comment.findOneAndUpdate(
                { _id: req.params.commentId },
                { "count.upvotes": currentUpvoteCount - 1 }
              );
            })
            .then((result) => {
              return res.status(201).json({ message: "un-upvoted" });
            });
        }
        return;
      }

      const upvote = new CommentVote({
        comment: req.params.commentId,
        voter: req.userData.userId,
        type: "upvote",
      });
      upvote
        .save()
        .then((result) => {
          return Comment.findOne({ _id: req.params.commentId });
        })
        .then((result) => {
          const currentUpvoteCount = result.count.upvotes;
          return Comment.findOneAndUpdate(
            { _id: result._id },
            { "count.upvotes": currentUpvoteCount + 1 }
          );
        })
        .then((result) => {
          res.status(201).json({
            message: "upvoted!",
          });
        });
    });
});

//for downvoting a post
router.post("/downvote/:commentId", auth, authRequired, (req, res, next) => {
  CommentVote.find({
    comment: req.params.commentId,
    voter: req.userData.userId,
  })
    .findOne()
    .populate("comment")
    .then((result) => {
      if (result) {
        const currentUpvoteCount = result.comment.count.upvotes;
        const currentDownvoteCount = result.comment.count.downvotes;
        const type = result.type;
        if (type === "upvote") 
        {
          CommentVote.findOneAndUpdate(
            { _id: result._id },
            { type: "downvote" }
          )
            .then((result) => {
              return Comment.findOneAndUpdate(
                { _id: req.params.commentId },
                {
                  "count.upvotes": currentUpvoteCount - 1,
                  "count.downvotes": currentDownvoteCount + 1,
                }
              );
            })
            .then((result) => {
              return res
                .status(201)
                .json({ message: "upvote converted to downvote" });
            });
        } 
        
        else 
        {
          CommentVote.findOneAndDelete({ _id: result._id })
            .then((result) => {
              return Comment.findOneAndUpdate(
                { _id: req.params.commentId },
                { "count.downvotes": currentDownvoteCount - 1 }
              );
            })
            .then((result) => {
              return res.status(201).json({ message: "un-downvoted" });
            });
        }
        return;
      }

      const downvote = new CommentVote({
        comment: req.params.commentId,
        voter: req.userData.userId,
        type: "downvote",
      });
      downvote
        .save()
        .then((result) => {
          return Comment.findOne({ _id: req.params.commentId });
        })
        .then((result) => {
          const currentDownvoteCount = result.count.downvotes;
          return Comment.findOneAndUpdate(
            { _id: result._id },
            { "count.downvotes": currentDownvoteCount + 1 }
          );
        })
        .then((result) => {
          res.status(201).json({
            message: "downvoted",
          });
        });
    });
});

module.exports = router;
