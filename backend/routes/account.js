"use strict";
const express = require("express");
const router = express.Router();
const kafka = require("../kafka/client");
const pool = require('../utils/mysqlConnection');
const { checkAuth } = require("../utils/passport");
const { validateAccount } = require("../validations/accountValidations");
const { STATUS_CODE, MESSAGES } = require('../utils/constants');
const logger = require("../utils/logger");

/**
 * to deactivate an account
 * @param req: user_id
 */
router.post("/deactivate", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "deactivate_account";

    const { error } = validateAccount(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("account", msg, function (err, results) {
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

router.post("/delete", checkAuth, async (req, res) => {
    let msg = req.body;
    msg.route = "delete_account";

    const { error } = validateAccount(req.body);
    if (error) {
        msg.error = error.details[0].message;
        logger.error(msg);
        return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    }

    kafka.make_request("account", msg, function (err, results) {
        if (err) {
            msg.error = err.data;
            logger.error(msg);
            return res.status(err.status).send(err.data);
        }
        else {
            if (results.status === 200) {
                let user_id = req.body.user_id;
                let sql = `CALL User_delete('${user_id}');`
                pool.query(sql, (err, sqlResult) => {
                    if (err) {
                        msg.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                        logger.error(msg);
                        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(MESSAGES.INTERNAL_SERVER_ERROR);
                    }
                    if (sqlResult && sqlResult.length > 0 && sqlResult[0][0].status === 'USER_DELETED') {
                        msg.status = STATUS_CODE.SUCCESS;
                        logger.info(msg);
                        return res.status(STATUS_CODE.SUCCESS).send(MESSAGES.SUCCESS);
                    } else {
                        msg.status = STATUS_CODE.BAD_REQUEST;
                        logger.info(msg);
                        return res.status(STATUS_CODE.BAD_REQUEST).send(sqlResult[0][0].status);
                    }
                });
            }
        }
    });
});

module.exports = router;