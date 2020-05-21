"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getTweetCountDaily = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let usertweets = await Users.findById(msg.user_id, { first_name: 1, last_name: 1, user_name: 1, tweets: 1, retweeted_tweets: 1 })
            .populate({
                path: 'tweets retweeted_tweets',
                select: 'tweet_text tweet_date',
                options: {
                    sort: { tweet_date: -1 }
                }
            });
        let tweets = usertweets.tweets;

        if (!tweets) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            let now = new Date();
            let tweetCountsDaily = new Array();
            let endDay = now;
            for (let dayIndex = 1; dayIndex <= 30; dayIndex++) {
                let startDay = new Date();
                startDay.setDate(now.getDate() - dayIndex);
                let dailyTweets = tweets.filter(e => (e.tweet_date > startDay && e.tweet_date < endDay));
                endDay = startDay;
                tweetCountsDaily[dayIndex - 1] = dailyTweets.length;
            }
            tweetCountsDaily = tweetCountsDaily.reverse();
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(tweetCountsDaily);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getTweetCountDaily = getTweetCountDaily;