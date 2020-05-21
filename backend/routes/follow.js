"use strict";
const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");
const { validateFollow } = require("../validations/followValidations");
const { STATUS_CODE } = require('../utils/constants');
const logger = require("../utils/logger");

router.post("/", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "follow_user";

    const { error } = validateFollow(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }
    
    kafka.make_request("follow", msg, function (err, results) {
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

router.post("/unfollow", checkAuth, async (req, res) => {
    let msg = req.body
    msg.route = "unfollow_user";
    const { error } = validateFollow(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("follow", msg, function (err, results) {
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

router.get("/followers/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_followers";
    msg.user_id = req.params.user_id;

    kafka.make_request("follow", msg, function (err, results) {
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

router.get("/following/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_following";
    msg.user_id = req.params.user_id;

    kafka.make_request("follow", msg, function (err, results) {
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

router.get("/users/:user_id", async (req, res) => {
    let msg = {};
    msg.route = "get_users_to_follow";
    msg.user_id = req.params.user_id;

    kafka.make_request("follow", msg, function (err, results) {
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