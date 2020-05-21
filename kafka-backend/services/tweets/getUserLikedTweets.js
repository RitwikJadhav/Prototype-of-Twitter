"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getUserLikedTweets = async (msg, callback) => {
    let response = {};
    let err = {};
    let page = msg.page;
    let pageSize = 10;
    try {
        let userLikedTweets = await Users.findById(msg.user_id, { liked: 1 })
            .populate({
                path: 'liked',
                select: 'tweet_text hashtags tweet_owner tweet_date likes replies retweeters tweet_image',
                populate: {
                    path: 'tweet_owner',
                    select: 'first_name last_name user_name user_image'
                }
            });
        if (!userLikedTweets) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            let likedTweets = [];
            userLikedTweets.liked.map(tweet => {
                likedTweets.push(Object.assign({}, tweet._doc,
                    {
                        likes_count: tweet.likes.length,
                        retweets_count: tweet.retweeters.length,
                        replies_count: tweet.replies.length,
                    }
                ))
            });
            likedTweets.reverse();
            let pageMax = Math.ceil(likedTweets.length / pageSize);

            if (page > pageMax) {
                page = pageMax;
            }
            let start = (page - 1) * pageSize;
            let end = page * pageSize;
            likedTweets = likedTweets.slice(start, end);

            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(likedTweets);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};
exports.getUserLikedTweets = getUserLikedTweets;