"use strict";
const User = require('../../models/users');
const List = require('../../models/lists')
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

async function createList(msg, callback) {
    let response = {};
    let err = {};
    let userUpdated;
    let listCreated;

    try {
        let user = await User.findById(msg.list_owner);
        if (!user) {
            console.log("in user not found");
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.USER_NOT_EXIST;
            return callback(err, null);
        }
        else {
            let list = new List(
                {
                    list_owner: msg.list_owner,
                    list_name: msg.list_name,
                    list_description: msg.list_description
                }
            )

            listCreated = await list.save();
            if (listCreated) {
                user.owned_lists.push(listCreated._id);
                userUpdated = await user.save();
                if (userUpdated) {
                    response.status = STATUS_CODE.SUCCESS;
                    response.data = MESSAGES.SUCCESS;
                    return callback(null, response);
                } else {
                    err.status = STATUS_CODE.BAD_REQUEST;
                    err.data = MESSAGES.ACTION_NOT_COMPLETE;
                    return callback(err, null);
                }
            } else {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.ACTION_NOT_COMPLETE;
                return callback(err, null);
            }
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.createList = createList;