const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { validateTweet } = require("../validations/tweetValidations");
const { STATUS_CODE } = require("../utils/constants");
const uploadFileToS3 = require('../utils/awsImageUpload');
const { checkAuth } = require("../utils/passport");
const multer = require('multer');
const logger = require("../utils/logger");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }

})
const upload = multer({ storage });
express().use(express.static('public'));

/**
 * To get all the tweets of a user
 */
router.get("/user/:user_id/:page_number", checkAuth, async (req, res) => {
    let msg = {
        user_id: req.params.user_id,
        page: req.params.page_number || 1,
        route: "get_user_tweets"
    }

    kafka.make_request("tweets", msg, function (err, results) {
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
 * To get all the tweets of the following of a user
 */
router.get("/following/:user_id/:page", async (req, res) => {
    let msg = {
        user_id: req.params.user_id,
        page: req.params.page || 1,
        route: "get_following_tweets"
    }

    kafka.make_request("tweets", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get_followers_tweets/:id---------");
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
 * To get all the tweets liked by a user
 */
router.get("/liked/:user_id/:page", checkAuth, async (req, res) => {
    let msg = {
        user_id: req.params.user_id,
        page: req.params.page || 1,
        route: "get_user_liked_tweets"
    }

    kafka.make_request("tweets", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get_user_liked_tweets/:id---------");
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
 * To get a single tweet with all details
 */
router.get("/tweet/:tweet_id", checkAuth, async (req, res) => {
    let msg = {
        tweet_id: req.params.tweet_id,
        route: "get_tweet"
    }

    kafka.make_request("tweets", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            console.log("-------error: tweet:get_tweet/:id---------");
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
 * Post a tweet
 * @param req: user_id,tweet_text
 */
router.post("/", upload.any(), async (req, res) => {
    /*const { error } = validateTweet(req.body);
    if (error) {
        console.log("-------error: tweet:post/---------");
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }*/
    let msg = req.body;
    msg.tweet_image = new Array();
    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            try {
                let data = new Date(Date.now()).toString();
                let resp = await uploadFileToS3(req.files[i], 'tweet/' + data, msg.user_id);
                msg.tweet_image[i] = resp.Location;
            } catch (error) {
                msg.error = error;
                logger.info(msg);
                console.log(error);
            }
        }
    }
    let rx = /(?:^|\s)(#[a-z0-9]\w*)/gi;
    var m, result = [];
    while (m = rx.exec(req.body.tweet_text)) {
        result.push(m[1]);
    }
    msg.route = "post_tweet";
    kafka.make_request("tweets", msg, function (err, results) {
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
 * To delete a tweet
 * @param req: user_id, tweet_id
 */
router.post("/delete", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "delete_tweet";
    const { error } = false;
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        console.log("-------error: tweet:post/deletetweet/---------");
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("tweets", msg, function (err, results) {
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