"use strict";
const User = require('../../models/users');
const List = require('../../models/lists')
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

async function updateList(msg, callback) {
    let response = {};
    let err = {};
    let listUpdated;

    try {
        let user = await User.findById(msg.list_owner);
        let list = await List.findById(msg.list_id)
        if (!user || !list) {
            console.log("in user not found");
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.USER_NOT_EXIST;
            return callback(err, null);
        }
        else {

            list.list_name = msg.list_name || list.list_name;
            list.list_description = msg.list_description || list.list_description;

            listUpdated = await list.save();
            if (listUpdated) {
                response.status = STATUS_CODE.SUCCESS;
                response.data = MESSAGES.UPDATE_SUCCESSFUL;
                return callback(null, response);
            } else {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.ACTION_NOT_COMPLETE;
                return callback(err, null);
            }
        }
    }
    catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.updateList = updateList;