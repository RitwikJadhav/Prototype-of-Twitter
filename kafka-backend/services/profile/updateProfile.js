"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let updateProfile = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id);

        if (!user) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.ACTION_NOT_COMPLETE;
            return callback(err, null);
        } else {
            let existingUser = await Users.findOne({
                user_name: msg.user_name
            });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.USER_NAME_ALREADY_EXISTS;
                return callback(err, null);
            }
            else {
                user.first_name = msg.first_name || user.first_name;
                user.last_name = msg.last_name || user.last_name;
                user.user_name = msg.user_name || user.user_name;
                user.city = msg.city;
                user.state = msg.state;
                user.zip_code = msg.zip_code;
                user.user_bio = msg.user_bio;
                user.user_image = msg.user_image || user.user_image;
                const updatedUser = await user.save();
                if (updatedUser) {
                    response.status = STATUS_CODE.SUCCESS;
                    response.data = MESSAGES.UPDATE_SUCCESSFUL;
                    return callback(null, response);
                } else {
                    err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                    err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                    return callback(err, null);
                }
            }
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.updateProfile = updateProfile;