"use strict";
const Tweets = require('../../models/tweets');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getTweet = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let tweet = await Tweets.findById(msg.tweet_id)
            .populate({
                path: 'tweet_owner replies.user',
                select: 'first_name last_name user_name user_image'
            })
            .populate({
                path: 'likes retweeters',
                select: 'first_name last_name user_name followers user_image'
            });
        if (!tweet) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            tweet.view_count += 1;
            let savedTweet = await tweet.save();
            savedTweet = Object.assign({},savedTweet._doc,
                {
                    likes_count: savedTweet.likes.length,
                    retweets_count: savedTweet.retweeters.length,
                    replies_count: savedTweet.replies.length,
                }
            );
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(savedTweet);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getTweet = getTweet;