const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: String, required: true },
  userName: { type: String, required: true },
  userImg: { type: String, required: true },
  reply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  placeId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImg: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model('Comment', commentSchema);
