"use strict";
const List = require('../../models/lists');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

async function getListUsers(msg, callback) {
    let response = {};
    let err = {};
    let userArray;
    
    switch (msg.type) {
        case "members":
            userArray = "members";
            break;
        case "subscribers":
            userArray = "subscribers";
            break;
    }

    try {
        let listUsers = await List.findById(msg.list_id, { userArray: 1})
            .populate({
                path: userArray,
                select: 'first_name last_name user_name user_image followers',
            });
        
            if (!listUsers) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.USER_NOT_EXIST;
            return callback(err, null);
        }
        else {
            response.status = STATUS_CODE.SUCCESS;
            response.data = listUsers[userArray];
            return callback(null, response);
        }
    } catch (error) {
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getListUsers = getListUsers;