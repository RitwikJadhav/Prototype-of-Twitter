"use strict";
const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");
const { validateMessage } = require("../validations/messageValidations");
const { STATUS_CODE } = require('../utils/constants');
const logger = require("../utils/logger");

router.post("/", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "send_message";

    const { error } = validateMessage(req.body);
    if (error) {
        msg.error=error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("messages", msg, function (err, results) {
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


router.get("/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_conversations";
    msg.user_id = req.params.user_id;
    
    kafka.make_request("messages", msg, function (err, results) {
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


router.get("/searched/:user_id/:target_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_SearchedConversation";
    msg.user_id = req.params.user_id;
    msg.target_id = req.params.target_id;
    
    kafka.make_request("messages", msg, function (err, results) {
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

router.get("/single/:user_id/:conversation_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_single_conversation";
    msg.conversation_id = req.params.conversation_id;
    msg.user_id = req.params.user_id;
    kafka.make_request("messages", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            res.status(err.status).send(err.data);
        }
        else {
            msg.status = results.status;
            logger.info(msg);
            res.status(results.status).send(results.data);
        }
    });
});

module.exports = router;