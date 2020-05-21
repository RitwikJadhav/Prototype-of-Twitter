const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");
const logger = require("../utils/logger");

/**
 * To get Top 10 tweets by views
 */
router.get("/topViewedTweets/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.count = 10,
    msg.route = "get_top_viewed_tweets";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

/**
 * To get Top 10 tweets by likes
 */
router.get("/topLikedTweets/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.count = 10,
    msg.route = "get_top_liked_tweets";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

/**
 * To get Top 5 tweets by retweets
 */
router.get("/topRetweetedTweets/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.count = 5;
    msg.route = "get_top_retweeted_tweets";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg); 
            return res.status(results.status).send(results.data);
        }
    });
});

/**
 * To get Tweet Count Hourly
 */
router.get("/tweetCountHourly/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_tweet_count_hourly";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

/**
 * To get Tweet Count Daily
 */
router.get("/tweetCountDaily/:user_id", async (req, res) => {
    let msg = {};
    msg.route = "get_tweet_count_daily";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

/**
 * To get Tweet Count Monthly
 */
router.get("/tweetCountMonthly/:user_id", async (req, res) => {
    let msg = {};
    msg.route = "get_tweet_count_monthly";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

/**
 * To get Profile View Count Daily
 */
router.get("/profileViewCountDaily/:user_id", async (req, res) => {
    let msg = {};
    msg.route = "get_profile_views_daily";
    msg.user_id = req.params.user_id;
    kafka.make_request("analytics", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get/:id---------");
            return res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

module.exports = router;