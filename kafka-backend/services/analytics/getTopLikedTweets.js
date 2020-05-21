"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

const tweetFormatter = (tweet, output) => {
    let tweetObject = {
        tweet_id: tweet._id,
        tweet_owner: tweet.tweet_owner,
        tweet_text: tweet.tweet_text,
        tweet_date: tweet.tweet_date,
        likes_count: tweet.likes ? tweet.likes.length : 0,
        replies_count: tweet.replies ? tweet.replies.length : 0,
        retweets_count: tweet.retweeters ? tweet.retweeters.length : 0,
        likes: tweet.likes,
        view_count: tweet.view_count
    };
    output.push(tweetObject);
};

let getTopLikedTweets = async (msg, callback) => {
    let response = {};
    let err = {};
    let output = [];
    const count = msg.count;
    try {
        let usertweets = await Users.findById(msg.user_id, { first_name: 1, last_name: 1, user_name: 1, tweets: 1, retweeted_tweets: 1 })
            .populate({
                path: 'tweets retweeted_tweets',
                select: 'tweet_text tweet_owner tweet_date likes replies retweeters tweet_image',
                populate: {
                    path: 'tweet_owner',
                    select: 'first_name last_name user_name user_image'
                },
                options: {
                    sort: { likes: -1 },
                    limit: count
                }
            });
        let tweets = usertweets.tweets;
        if (!tweets) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            tweets.map(tweet => tweetFormatter(tweet, output));
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

exports.getTopLikedTweets = getTopLikedTweets;