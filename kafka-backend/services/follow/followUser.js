"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let followUser = async (msg, callback) => {
    let response = {};
    let err = {};
    let userUpdated;
    let targetUserUpdated;

    try {
        let user = await Users.findById(msg.user_id);
        let targetUser = await Users.findById(msg.target_user_id);

        let index = user.following.indexOf(msg.target_user_id);
        if (index === -1) {
            user.following.push(msg.target_user_id);
            userUpdated = await user.save();
        }

        index = targetUser.followers.indexOf(msg.user_id);
        if (index === -1) {
            targetUser.followers.push(msg.user_id);
            targetUserUpdated = await targetUser.save();
        }

        if (userUpdated && targetUserUpdated) {
            response.status = STATUS_CODE.SUCCESS;
            response.data = MESSAGES.SUCCESS;
            return callback(null, response);
        } else {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }

    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.followUser = followUser;