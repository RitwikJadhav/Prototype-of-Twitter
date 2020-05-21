"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getFollowing = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let following = await Users.findById(msg.user_id, { following: 1 }).populate("following", "first_name last_name user_name user_image", { is_active: true });
        if (following) {
            response.data = JSON.stringify(following);
        }
        else {
            response.data = JSON.stringify([]);
        }
        response.status = STATUS_CODE.SUCCESS;
        return callback(null, response);
    } catch (error) {
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getFollowing = getFollowing;