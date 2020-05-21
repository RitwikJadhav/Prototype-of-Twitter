"use strict";
const Tweet = require("../../models/tweets");
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let deleteTweet = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let { user_id, tweet_id } = msg;
        let targetUser = await Users.findById(user_id);
        let targetTweet = await Tweet.findById(tweet_id);
        if (!targetUser || !targetTweet) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            if (targetTweet.tweet_owner == user_id) { // using == as type of the Ids are different
                targetUser.tweets.remove(tweet_id);
                let updatedUser = await targetUser.save();
                Tweet.findByIdAndRemove(tweet_id, (error, success) => {
                    if (updatedUser && success) {
                        response.status = STATUS_CODE.SUCCESS;
                        response.data = MESSAGES.DELETE_SUCCESSFUL;
                        return callback(null, response);
                    }
                    else {
                        err.status = STATUS_CODE.BAD_REQUEST;
                        err.data = MESSAGES.ACTION_NOT_COMPLETE;
                        return callback(err, null);
                    }
                })
            }
            else {
                targetUser.retweeted_tweets.remove(tweet_id);
                targetTweet.retweeters.remove(user_id);
                let updatedUser = await targetUser.save();
                let updatedTweet = await targetTweet.save();
                if (!updatedUser || !updatedTweet) {
                    err.status = STATUS_CODE.BAD_REQUEST;
                    err.data = MESSAGES.ACTION_NOT_COMPLETE;
                    return callback(err, null);
                }
                else {
                    response.status = STATUS_CODE.SUCCESS;
                    response.data = MESSAGES.DELETE_SUCCESSFUL;
                    return callback(null, response);
                }
            }
        }

    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};
exports.deleteTweet = deleteTweet;