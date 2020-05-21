"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Schema
const tweetSchema = new schema(
  {
    tweet_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet_text: {
      type: String,
      trim: true
    },
    tweet_image: [{
        type: String,
        trim: true
    }],
    hashtags: [{
      type: String,
      trim: true
    }],
    tweet_date: {
        type: Date,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    replies: [{
        reply_text: {
            type: String,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        reply_date: {
            type: Date,
            default: Date.now(),
            trim: true
        },
    }],
    retweeters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    view_count : {
        type : Number,
        default: 0
    }

  },
  { versionKey: false }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;