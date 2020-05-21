"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let unfollowUser = async (msg, callback) => {
    let response = {};
    let err = {};
    let userUpdated;
    let targetUserUpdated;

    try {
        let user = await Users.findById(msg.user_id);
        let targetUser = await Users.findById(msg.target_user_id);

        user.following.remove(msg.target_user_id);
        userUpdated = await user.save();

        targetUser.followers.remove(msg.user_id);
        targetUserUpdated = await targetUser.save();

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

exports.unfollowUser = unfollowUser;