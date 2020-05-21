const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { validateLikes, validateReplies } = require("../validations/tweetValidations");
const { STATUS_CODE } = require("../utils/constants");
const { checkAuth } = require("../utils/passport");
const logger = require("../utils/logger");

/**
 * To retweet a tweet
 * @param req:user_id, tweet_id
 */
router.post("/retweet", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "post_retweet";
    const { error } = false;
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        console.log("-------error: tweet:post/retweet/---------");
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("tweet_actions", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
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
 * To post a like a tweet
 * @param req:  user_id,tweet_id
 */
router.post("/like", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "post_like";
    const { error } = validateLikes(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("tweet_actions", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
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
 * To post a unlike a tweet
 * @param req:  user_id,tweet_id
 */
router.post("/unlike", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "post_unlike";
    const { error } = validateLikes(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("tweet_actions", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
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
 * To post a reply on a tweet
 * @param req: user_id, tweet_id, reply_text
 */
router.post("/replies", checkAuth, async (req, res) => {
    /*const { error } = validateReplies(req.body);
    if (error) {
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }*/
    let msg = req.body;
    msg.route = "post_replies";
    kafka.make_request("tweet_actions", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
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