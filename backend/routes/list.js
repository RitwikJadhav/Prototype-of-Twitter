const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const { checkAuth } = require("../utils/passport");
const { validateCreateList, validateUpdateList, validateDeleteList, validateAddToList, validateRemoveFromList } = require("../validations/listValidations");
const { STATUS_CODE } = require('../utils/constants');
const logger = require("../utils/logger");

//Get List memeber tweets
router.get("/tweets/:list_id", checkAuth, (req, res) => {
    let msg = {
        list_id: req.params.list_id,
        route: "get_member_tweets"
    }

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//GET user lists
router.get("/:user_id/:getType", checkAuth, (req, res) => {
    let msg = {};

    msg.user_id = req.params.user_id;
    msg.route = "get_user_lists";
    msg.type = req.params.getType;

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//Create user lists
router.post("/create", checkAuth, (req, res) => {

    const msg = req.body;
    msg.route = "create_list";

    const { error } = validateCreateList(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//Update user lists
router.post("/update", checkAuth, (req, res) => {

    const msg = req.body;
    msg.route = "update_list";

    const { error } = validateUpdateList(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});


//Delete user lists
router.post("/delete", checkAuth, (req, res) => {

    const msg = req.body;
    msg.route = "delete_list";

    const { error } = validateDeleteList(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("list", msg, function (err, results) {
        console.log("in make request call back");
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//Add member/subscriber list
router.post("/add", checkAuth, (req, res) => {
    const msg = req.body;
    msg.route = "add_to_list";

    const { error } = validateAddToList(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//Remove member/subscriber list
router.post("/remove", checkAuth, (req, res) => {

    const msg = req.body;
    msg.route = "remove_from_list";

    const { error } = validateRemoveFromList(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            or(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//GET list users
router.get("/users/:list_id/:getType", checkAuth, (req, res) => {
    const msg = {};
    msg.list_id = req.params.list_id;
    msg.route = "get_list_users";
    msg.type = req.params.getType;

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});

//GET list
router.get("/:list_id", checkAuth, (req, res) => {
    const msg = {};
    msg.list_id = req.params.list_id;
    msg.route = "get_list";

    kafka.make_request("list", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        } else {
            msg.status = results.status;
            logger.info(msg);
            return res.status(results.status).send(results.data);
        }
    });
});



module.exports = router;