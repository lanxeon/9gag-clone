const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authRequired = require("../middleware/authRequired");

const multer = require("multer");
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "video/webm": "mkv",
  "video/x-matroska": "mkv",
  "video/mp4" : "mp4"
};

const Post = require("../models/postModel");
const PostVote = require("../models/postVoteModel");
const Comment = require("../models/commentModel");
const CommentVote = require("../models/commentVoteModel");
const User = require("../models/userModel");

//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let mime = MIME_TYPE[file.mimetype];
    let error = new Error("Invalid MIME type");
    if (mime) error = null;
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});



//Posting a new post
router.post("", auth, authRequired, multer({ storage: storage }).single("image"),
  async(req, res, next) => {
    try {
    const url = req.protocol + "://" + req.get("host");

    const post = new Post({
      title: req.body.title,
      contentPath: url + "/images/" + req.file.filename,
      contentType: req.file.mimetype.includes('image') ? 'image' : 'video',
      count: {
        upvotes: 0,
        downvotes: 0,
        comments: 0,
      },
      poster: req.userData.userId,
      category: req.body.category
    });

    result = await post.save()
      res.status(201).json({
        message: "Successfully created post",
        post: result,
      });
    } catch(err) {
        res.status(500).json({ message: "Post creation failed", error: err });
    }
});



//get all posts
router.get("", auth, (req, res, next) => {
  let query = Post.find().populate('poster', '_id username dp');
  let queryData, modifiedPosts;

  if (req.query.userId) {
    query
      .then((posts) => {
        queryData = posts;
        modifiedPosts = [...posts];
        return PostVote.find({ voter: req.query.userId });
      })
      .then((upvotes) => {
        newModifiedPosts = modifiedPosts.map((post) => {
          newPost = post.toObject();
          newPost.voteStatus = null;
          for (let i = 0; i < upvotes.length; i++) {
            let upvote = upvotes[i].toObject();
            if (upvote.post.equals(newPost._id)) {
              if (upvote.type === "upvote") 
                newPost.voteStatus = "upvoted";
              else 
                newPost.voteStatus = "downvoted";
              break;
            }
          }
          return newPost;
        });
        return res.status(200).json({
          message: "Fetched Posts",
          posts: queryData,
          modifiedPosts: newModifiedPosts.reverse(),
        });
      });
    return;
  } 
  
  else 
  {
    query
      .then((documents) => {
        queryData = documents;
        return Post.countDocuments();
      })
      .then((count) => {
        res.status(200).json({
          message: "Fetched posts!",
          posts: queryData.reverse(),
          count: count,
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to fetch posts" });
      });
  }
});


//get all posts of a specific user
router.get('/user/:id', auth, async(req, res, next) => {
  try
  {
    const query = Post.find({poster: req.params.id}).populate('poster', '_id username dp').lean();
    if(req.isAuthenticated)
    {
      let posts = await query;
      let postIds = posts.map(post => post._id);

      let votes = await PostVote.find({voter: req.userData.userId, post: {$in: postIds}}).lean();
      if(votes)
      {
        votes.forEach(vote => {
          let votedPost = posts.find(post => post._id.equals(vote.post));

          if(votedPost)
          {
            let index = posts.indexOf(votedPost);
            posts[index].voteStatus = vote.type === 'upvote' ? 'upvoted' : 'downvoted';
          }
        });
      }

      // console.log(posts);

      return res.status(200).json({
        message: 'Acquired posts successfully',
        posts: posts.reverse()
      });
    }

    else
    {
      let posts = await query;
      return res.status(200).json({
        message: 'got the posts without auth',
        posts: posts.reverse()
      });
    }
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: err
    });
  }
});


//get all posts upvoted by a specific user
router.get('/user/upvoted/:id', auth, async(req, res, next) => {
  try
  {
    const query = PostVote.find({voter: req.params.id, type: "upvote"}).populate('post').lean();
    if(req.isAuthenticated)
    {
      let postVotes = await query;
      // let posts = postVotes.map(vote => vote.post.populate('poster', '_id username dp').lean());
      let posts = postVotes.map(vote => vote.post);

      // let getNewPosts = async() => { 
      //   return posts.map(async(post) => {
      //       post.voteStatus = 'upvoted';
      //       let poster = await User.findById(post.poster).lean();
      //       post.poster = {
      //         _id: poster._id,
      //         username: poster.username,
      //         dp: poster.dp
      //       };
      //       return post;
      //     });
      // }

      for(let i = 0; i < posts.length; i++)
      {
        let post = posts[i];
        post.voteStatus = 'upvoted';
        let poster = await User.findById(post.poster).lean();
        post.poster = {
          _id: poster._id,
          username: poster.username,
          dp: poster.dp
        };
      }

      return res.status(200).json({
        message: 'Acquired posts successfully',
        posts: posts.reverse()
      });
    }

    else
    {
      postVotes = await query;
      let posts = postVotes.map(vote => vote.post);

      for(let i = 0; i < posts.length; i++)
      {
        let post = posts[i];
        let poster = await User.findById(post.poster).lean();
        post.poster = {
          _id: poster._id,
          username: poster.username,
          dp: poster.dp
        };
      }

      return res.status(200).json({
        message: 'got the posts without auth',
        posts: posts.reverse()
      });
    }
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: err
    });
  }
});



//get a single post (by id)
router.get("/:id", auth, (req, res, next) => {
  let query = Post.findById(req.params.id).populate('poster', '_id username dp');
  let postData;

  if (!req.isAuthenticated) {
    query
      .then((post) => {
        if (post) {
          return res.status(200).json(post);
        } else return res.status(404).json({ message: "Post not Found" });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Failed to fetch post" });
      });
    return;
  } 

  else 
  {
    query
      .then((post) => {
        postData = post;
        return PostVote.find({
          voter: req.userData.userId,
          post: req.params.id,
        });
      })
      .then((result) => {
        let modifiedPost = postData.toObject();
        modifiedPost.voteStatus = null;
        if (result[0])
          modifiedPost.voteStatus =
            result[0].type === "upvote" ? "upvoted" : "downvoted";
        return res.status(200).json(modifiedPost);
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
    return;
  }
});



//getting posts of a specific category
router.get('/categories/:category', auth, (req, res, next) => {
  let query = Post.find({category: req.params.category}).populate('poster', '_id username dp');
  let queryData, modifiedPosts, postIds;

  if (req.isAuthenticated) 
  {
    query.lean()
      .then((posts) => {
        queryData = posts;
        modifiedPosts = [...posts];
        postIds = queryData.map(post => post._id);
        return PostVote.find({ voter: req.userData.userId, post: {$in: postIds}}).lean();
      })
      .then((upvotes) => {
        if (upvotes) 
        {
          let storedRes = upvotes;
          storedRes.forEach((obj) => {
            specPost = queryData.find((post) =>
              post._id.equals(obj.post)
            );
            if (specPost) 
            {
              index = queryData.indexOf(specPost);
              queryData[index].voteStatus = obj.type == "upvote" ? "upvoted" : "downvoted";
            }
          });
        }
        return res.status(200).json({
          message: "Fetched Posts",
          posts: queryData.reverse()
        });
      });
    }

  else 
  {
    query
      .then((documents) => {
        queryData = documents;
        return Post.countDocuments();
      })
      .then((count) => {
        res.status(200).json({
          message: "Fetched posts!",
          posts: queryData.reverse()
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to fetch posts" });
      });
  }
});



//for deleting a post
router.delete("/:id", auth, authRequired, async(req, res, next) => {
  try
  {
    let result = await Post.deleteOne({ _id: req.params.id, poster: req.userData.userId });
    if (result.n > 0) {
      console.log("deleted post on server side");
      let delPostVotes = await PostVote.deleteMany({post: req.params.id});
      console.log("deleted upvotes of the post");
      let comments = await Comment.find({post: req.params.id});
      let commentIds = comments.map(comm => comm._id);
      let delComments = await Comment.deleteMany({_id: {$in: commentIds}});
      console.log("deleted comments");
      let delCommentVotes = await CommentVote.deleteMany({comment: {$in: commentIds}});
      console.log("deleted comment votes");
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "You are not authorized!",
      });
    }
  }
    catch(err) 
    {
      res.status(500).json({ 
          message: "Failed to fetch post",
          error: err });
    }
});



//for upvoting a post
router.post("/upvote/:postId", auth, authRequired, (req, res, next) => {
  PostVote.find({ post: req.params.postId, voter: req.userData.userId })
    .findOne()
    .populate("post")
    .then((result) => {
      if (result) {
        const currentUpvoteCount = result.post.count.upvotes;
        const currentDownvoteCount = result.post.count.downvotes;
        const type = result.type;
        if (type === "downvote") {
          PostVote.findOneAndUpdate({ _id: result._id }, { type: "upvote" })
            .then((result) => {
              return Post.findOneAndUpdate(
                { _id: req.params.postId },
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
          PostVote.findOneAndDelete({ _id: result._id })
            .then((result) => {
              return Post.findOneAndUpdate(
                { _id: req.params.postId },
                { "count.upvotes": currentUpvoteCount - 1 }
              );
            })
            .then((result) => {
              return res.status(201).json({ message: "un-upvoted" });
            });
        }
        return;
      }

      const upvote = new PostVote({
        post: req.params.postId,
        voter: req.userData.userId,
        type: "upvote",
      });
      upvote
        .save()
        .then((result) => {
          return Post.findOne({ _id: req.params.postId });
        })
        .then((result) => {
          const currentUpvoteCount = result.count.upvotes;
          return Post.findOneAndUpdate(
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
router.post("/downvote/:postId", auth, authRequired, (req, res, next) => {
  PostVote.find({ post: req.params.postId, voter: req.userData.userId })
    .findOne()
    .populate("post")
    .then((result) => {
      if (result) {
        const currentUpvoteCount = result.post.count.upvotes;
        const currentDownvoteCount = result.post.count.downvotes;
        const type = result.type;
        if (type === "upvote") {
          PostVote.findOneAndUpdate({ _id: result._id }, { type: "downvote" })
            .then((result) => {
              return Post.findOneAndUpdate(
                { _id: req.params.postId },
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
          PostVote.findOneAndDelete({ _id: result._id })
            .then((result) => {
              return Post.findOneAndUpdate(
                { _id: req.params.postId },
                { "count.downvotes": currentDownvoteCount - 1 }
              );
            })
            .then((result) => {
              return res.status(201).json({ message: "un-downvoted" });
            });
        }
        return;
      }

      const downvote = new PostVote({
        post: req.params.postId,
        voter: req.userData.userId,
        type: "downvote",
      });
      downvote
        .save()
        .then((result) => {
          return Post.findOne({ _id: req.params.postId });
        })
        .then((result) => {
          const currentDownvoteCount = result.count.downvotes;
          return Post.findOneAndUpdate(
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
