"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const userSchema = new schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true
    },
    last_name: {
      type: String,
      trim: true,
      required: true
    },
    user_name: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    email_id: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    is_active: {
      type: Boolean,
      default: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zip_code: {
      type: String,
      trim: true
    },
    user_bio: {
      type: String,
      trim: true
    },
    user_image: {
      type: String,
      trim: true
    },
    conversations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation"
    }],
    tweets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }],
    retweeted_tweets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }],
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }],
    replied: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }],
    liked: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }],
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    subscribed_lists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "List"
    }],
    membered_lists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "List"
    }],
    owned_lists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "List"
    }],
    profile_views: [{
      type: Date
    }]
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;