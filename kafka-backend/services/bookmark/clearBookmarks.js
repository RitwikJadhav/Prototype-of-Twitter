"use strict";
const Users = require('../../models/users');
const redisClient = require("../../utils/redisConfig");
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let clearBookmarks = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id)

        if (user) {
            let updatedUser = await Users.findByIdAndUpdate(msg.user_id, { $set: { "bookmarks": [] } })
            if (!updatedUser) {
                throw err;
            } else {
                redisClient.setex(msg.user_id, 36000, JSON.stringify([]));
                response.status = STATUS_CODE.SUCCESS;
                response.data = MESSAGES.DELETE_SUCCESSFUL;
                return callback(null, response);
            }
        } else {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.DATA_NOT_FOUND;
            return callback(err, null);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.clearBookmarks = clearBookmarks;