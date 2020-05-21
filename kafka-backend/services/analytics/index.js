"use strict";
const { getTopViewedTweets } = require("./getTopViewedTweets");
const { getTopLikedTweets } = require("./getTopLikedTweets");
const { getTopRetweetedTweets } = require("./getTopRetweetedTweets");
const { getTweetCountHourly } = require("./getTweetCountHourly");
const { getTweetCountDaily } = require("./getTweetCountDaily");
const { getTweetCountMonthly } = require("./getTweetCountMonthly");
const { getProfileViewsDaily } = require("./getProfileViewsDaily");

function handle_request(msg, callback) {
    switch (msg.route) {
        case "get_top_viewed_tweets":
            getTopViewedTweets(msg, callback);
            break;
        
        case "get_top_liked_tweets":
            getTopLikedTweets(msg, callback);
            break;
        
        case "get_top_retweeted_tweets":
            getTopRetweetedTweets(msg, callback);
            break;
        
        case "get_tweet_count_hourly":
            getTweetCountHourly(msg, callback);
            break;
        
        case "get_tweet_count_daily":
            getTweetCountDaily(msg, callback);
            break;
        
        case "get_tweet_count_monthly":
            getTweetCountMonthly(msg, callback);
            break;
        
        case "get_profile_views_daily":
            getProfileViewsDaily(msg, callback);
            break;
    }
}

exports.handle_request = handle_request;