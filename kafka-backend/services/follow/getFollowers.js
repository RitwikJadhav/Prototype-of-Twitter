"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getFollowers = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let followers = await Users.findById(msg.user_id, { followers: 1 }).populate("followers", "first_name last_name user_name", { is_active: true});
        if (followers) {
            response.data = JSON.stringify(followers);
        }
        else {
            response.data = JSON.stringify([]);
        }
        response.status = STATUS_CODE.SUCCESS;
        return callback(null, response);

    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getFollowers = getFollowers;