"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

const tweetFormatter = (tweet, user, output) => {
    let tweetObject = {
        user_id: user._id,
        _id: tweet._id,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        tweet_id: tweet._id,
        tweet_owner: tweet.tweet_owner,
        tweet_text: tweet.tweet_text,
        tweet_date: tweet.tweet_date,
        hashtags: tweet.hashtags,
        tweet_image: tweet.tweet_image,
        likes_count: tweet.likes ? tweet.likes.length : 0,
        replies_count: tweet.replies ? tweet.replies.length : 0,
        retweets_count: tweet.retweeters ? tweet.retweeters.length : 0,
        likes: tweet.likes,
        retweeters: tweet.retweeters
    };
    output.push(tweetObject);
};

let getUserTweets = async (msg, callback) => {
    let response = {};
    let err = {};
    let output = [];
    let page = msg.page;
    let pageSize = 10;
    try {
        let userTweets = await Users.findById(msg.user_id, { first_name: 1, last_name: 1, user_name: 1, tweets: 1, retweeted_tweets: 1 })
            .populate({
                path: 'tweets retweeted_tweets',
                select: 'tweet_text hashtags tweet_owner tweet_date likes replies retweeters tweet_image',
                populate: {
                    path: 'tweet_owner',
                    select: 'first_name last_name user_name user_image'
                }
            });
        if (!userTweets) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            userTweets.tweets.map(tweet => tweetFormatter(tweet, userTweets, output));
            userTweets.retweeted_tweets.map(tweet => tweetFormatter(tweet, userTweets, output));
            output.sort((tweet1, tweet2) => (tweet1.tweet_date < tweet2.tweet_date) ? 1 : -1);

            let pageMax = Math.ceil(output.length / pageSize);

            if (page > pageMax) {
                page = pageMax;
            }
            let start = (page - 1) * pageSize;
            let end = page * pageSize;
            output = output.slice(start,end);

            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(output);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getUserTweets = getUserTweets;