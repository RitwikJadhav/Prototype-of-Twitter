"use strict";
const { postTweet } = require("./postTweet");
const { getTweet } = require("./getTweet");
const { getUserTweets } = require("./getUserTweets");
const { deleteTweet } = require("./deleteTweet");
const { getUserLikedTweets } = require("./getUserLikedTweets");
const { getFollowingTweets } = require("./getFollowingTweets");

function handle_request(msg, callback) {
    switch (msg.route) {
        case "post_tweet":
            postTweet(msg, callback);
            break;
        case "get_tweet":
            getTweet(msg, callback);
            break;
        case "get_user_tweets":
            getUserTweets(msg, callback);
            break;
        case "delete_tweet":
            deleteTweet(msg, callback);
            break;
        case "get_user_liked_tweets":
            getUserLikedTweets(msg, callback);
            break;
        case "get_following_tweets":
            getFollowingTweets(msg, callback);
            break;
    }
}

exports.handle_request = handle_request;