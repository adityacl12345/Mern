const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const Comment = require('../models/comment');
const User = require('../models/user');

const getCommentsByPlaceId = async (req, res, next) => {
    const { pid } = req.params;
    let placeComments;
    try {
        placeComments = await Comment.find({placeId: pid});
    } catch(err) {
        return next(new HttpError('Something went wrong!', 500))
    }
    if(!placeComments) {
        return next(new HttpError('Could not Find a place with this user Id!', 404));
    }
    res.json({comments: placeComments.map(comment => comment.toObject({getters: true}))});
};

const createComment = async (req, res, next) => {
    const { placeId, userId, text } = req.body;

    let user, userName, userImg;
    try {
        user = await User.findById(userId);
        userName = user.name;
        userImg = user.image;
    } catch(err) {
        return next(err);
    }

    const createdComment = new Comment({
        placeId,
        userId,
        userName,
        userImg,
        text
    });    
    try {
        if(createdComment) {
            console.log(createdComment);
            await createdComment.save();
        }
    } catch(err) {
        const error = new HttpError('Failed to post comment!', 500);
        return next(error);
    }

    res.status(201).json({comment: createdComment});
};

const replyComment = async (req, res) => {
    const { user, reply } = req.body;
  
    if (!user || !reply) {
      return res.status(400).json({ error: "User and text are required for a reply." });
    }

    let userP, userName, userImg;
    try {
        userP = await User.findById(user);
        userName = userP.name;
        userImg = userP.image;
    } catch(err) {
        return next(err);
    }
  
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment)
        return res.status(404).json({ error: "Comment not found" }); 
      comment.replies.push({ user, userName, userImg, reply });
      await comment.save();
  
      res.status(201).json({ message: "Reply added", replies: comment.replies });
    } catch (err) {
      console.error("Error adding reply:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const result = await Comment.findByIdAndDelete(req.params.id);
    
        if (!result) {
          return res.status(404).json({ error: "Comment not found" });
        }
    
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getCommentsByPlaceId = getCommentsByPlaceId;
exports.createComment = createComment;
exports.replyComment = replyComment;
exports.deleteComment = deleteComment;