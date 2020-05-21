"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getUsersToFollow = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let users;
        let usersFollowed = await Users.findById(msg.user_id, { following: 1 });
        if (usersFollowed) {
            users = await Users.find({ $and: [{ "_id": { $nin: usersFollowed.following } }, { "_id": { $ne: msg.user_id } }, { "is_active": true }] }, { first_name: 1, last_name: 1, user_name: 1, user_image: 1, followers: 1 })
                .limit(3);
        }
        if (users) {
            response.data = JSON.stringify(users);
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

exports.getUsersToFollow = getUsersToFollow;