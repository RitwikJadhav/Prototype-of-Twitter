"use strict";
const List = require('../../models/lists');
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
        tweet_image: tweet.tweet_image,
        likes_count: tweet.likes ? tweet.likes.length : 0,
        replies_count: tweet.replies ? tweet.replies.length : 0,
        retweets_count: tweet.retweeters ? tweet.retweeters.length : 0,
        likes: tweet.likes,
        hashtags: tweet.hashtags,
        retweeters: tweet.retweeters
    };
    output.push(tweetObject);
};

let getMemberTweets = async (msg, callback) => {
    let response = {};
    let err = {};
    let output = [];
    let result = {};
    console.log(msg);
    try {
        let list = await List.findById(msg.list_id, {list_name:1,list_description:1,list_owner:1, members: 1 , subscribers:1})
            .populate({
                path: "list_owner",
                select: 'first_name last_name user_name user_image',
            })
            .populate({
                path: "members",
                select: "first_name last_name user_name user_image tweets retweeted_tweets",
                match: { "is_active": true },
                populate: {
                    path: "tweets retweeted_tweets",
                    select: 'tweet_text tweet_owner tweet_date likes hashtags replies retweeters tweet_image',
                    model: "Tweet",
                    populate: {
                        path: 'tweet_owner',
                        model: 'User',
                        select: 'first_name last_name user_name user_image'
                    }
                }
            });
        if (!list) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            list.members.map(member => {
                member.tweets.map(tweet => tweetFormatter(tweet, member, output));
                member.retweeted_tweets.map(tweet => tweetFormatter(tweet, member, output));
            });
            output.sort((tweet1, tweet2) => (tweet1.tweet_date < tweet2.tweet_date) ? 1 : -1);
            result.list_name= list.list_name;
            result.list_description=list.list_description;
            result.list_members = list.members;
            result.list_subscribers = list.subscribers;
            result.list_owner = list.list_owner;
            result.tweets = output;
            response.status = STATUS_CODE.SUCCESS;
            response.data = result;
            return callback(null, response)
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};
exports.getMemberTweets = getMemberTweets;