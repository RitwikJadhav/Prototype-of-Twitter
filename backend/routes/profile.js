"use strict";
const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const passwordHash = require('password-hash');
const pool = require('../utils/mysqlConnection');
const stateNames = require('../utils/stateNames');
const uploadFileToS3 = require('../utils/awsImageUpload');
const { checkAuth } = require("../utils/passport");
const { validateProfile } = require("../validations/profileValidations");
const { validatePassword } = require("../validations/passwordValidations");
const { STATUS_CODE, MESSAGES } = require('../utils/constants');
const multer = require('multer');
const path = require('path');
const logger = require("../utils/logger");
const storage = multer.diskStorage({
    destination: path.join(__dirname, '..') + '/uploads',
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });
express().use(express.static('public'));

router.get("/:user_id", checkAuth, async (req, res) => {
    let msg = {};
    msg.route = "get_profile";
    msg.user_id = req.params.user_id;

    kafka.make_request("profile", msg, function (err, results) {
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

router.post("/", upload.single('user_image'), async (req, res) => {
    // const { error } = validateProfile(req.body);
    // if (error) {
    //     return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    // }
    if(!stateNames.includes(req.body.state)){
        return res.status(STATUS_CODE.BAD_REQUEST).send(MESSAGES.INVALID_STATE);
    }
    let msg = req.body;
    if (req.files) {
        uploadFileToS3(req.files[0], 'profile', msg.user_id);
    }
    msg.route = "update_profile";
    let imageUrl = "";
    if (req.file) {
        try {
            imageUrl = await uploadFileToS3(req.file, 'profile', msg.user_id);
            msg.user_image = imageUrl.Location;
        } catch (error) {
            console.log(error);
        }
    }
    console.log('Sending kafka request');
    kafka.make_request("profile", msg, function (err, results) {
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

router.post("/password", checkAuth, async (req, res) => {
    const { error } = validatePassword(req.body);
    if (error) {
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }
    let hashedPassword = passwordHash.generate(req.body.password);
    let sql = `CALL Password_update('${req.body.user_id}', NULL, '${hashedPassword}');`;
    pool.query(sql, (err, sqlResult) => {
        if (err) {
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(MESSAGES.INTERNAL_SERVER_ERROR);
        }
        if (sqlResult && sqlResult.length > 0 && sqlResult[0][0].status === 'PASSWORD_UPDATED') {
            return res.status(STATUS_CODE.SUCCESS).send(MESSAGES.SUCCESS);
        }
        else {
            return res.status(STATUS_CODE.UNAUTHORIZED).send(MESSAGES.INVALID_CREDENTIALS);
        }
    });
});

module.exports = router;