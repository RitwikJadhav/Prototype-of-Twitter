"use strict";
const List = require('../../models/lists');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

async function getList(msg, callback) {
    let response = {};
    let err = {};
    
    try {
        let list = await List.findById(msg.list_id);
        if (!list) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.USER_NOT_EXIST;
            return callback(err, null);
        }
        else {
            response.status = STATUS_CODE.SUCCESS;
            response.data = list;
            return callback(null, response);
        }
    } catch (error) {
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getList = getList;