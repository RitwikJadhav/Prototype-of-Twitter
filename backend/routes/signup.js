"use strict";
const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const passwordHash = require('password-hash');
const pool = require('../utils/mysqlConnection');
const { validateUser } = require("../validations/signupValidations");
const { STATUS_CODE, MESSAGES } = require('../utils/constants');
const logger = require("../utils/logger");

router.post("/", async (req, res) => {
    let msg = req.body;
    const { error } = validateUser(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }
    kafka.make_request("signup", req.body, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        }
        else {
            if (results.status === 200) {
                let user_id = results.data;
                let hashedPassword = passwordHash.generate(req.body.password);
                let sql = `CALL User_put('${req.body.email_id}', '${user_id}', '${hashedPassword}');`
                pool.query(sql, (err, sqlResult) => {
                    if (err) {
                        msg.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                        logger.error(msg);
                        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(MESSAGES.INTERNAL_SERVER_ERROR);
                    }
                    if (sqlResult && sqlResult.length > 0 && sqlResult[0][0].status === 'USER_ADDED') {
                        msg.status = STATUS_CODE.SUCCESS;
                        logger.info(msg);
                        return res.status(STATUS_CODE.SUCCESS).send(MESSAGES.SUCCESS);
                    }
                });
            }
        }
    });
});

module.exports = router;
