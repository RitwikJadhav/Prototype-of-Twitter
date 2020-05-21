"use strict";
const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");
const { validateBookmark, validateClearBookmark } = require("../validations/bookmarkValidation");
const { STATUS_CODE } = require('../utils/constants');
const logger = require("../utils/logger");

router.post("/", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "add_bookmark";

    const { error } = validateBookmark(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.info(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("bookmarks", msg, function (err, results) {
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
    msg.route = "get_bookmarks";
    msg.user_id = req.params.user_id;
    
    kafka.make_request("bookmarks", msg, function (err, results) {
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

//Deletes single bookmark
router.post("/delete", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "delete_bookmark";
    const { error } = validateBookmark(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("bookmarks", msg, function (err, results) {
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

//Clears entire bookmarks array
router.post("/clear", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "clear_bookmarks";
    const { error } = validateClearBookmark(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("bookmarks", msg, function (err, results) {
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