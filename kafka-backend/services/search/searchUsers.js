"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let searchUsers = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let name = msg.input.split(' ')[0];
        let userRegex = new RegExp(name, 'i')
        let users = await Users.find({ $and: [{ $or: [{ "first_name": userRegex }, { "last_name": userRegex }, { "user_name": userRegex }] }, { "is_active": true }] }, { first_name: 1, last_name: 1, user_name: 1, user_bio: 1, user_image: 1, followers: 1 });
        if (!users) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        }
        else {
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(users);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};
exports.searchUsers = searchUsers;