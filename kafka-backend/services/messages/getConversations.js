"use strict";
const Users = require('../../models/users');
const Conversation = require("../../models/conversations");

const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getConversations = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id)
        if (!user) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.INVALID_INPUTS;
            return callback(err, null);
        }

        let userConversations = await Conversation.find({ $or: [{ "user1": msg.user_id }, { "user2": msg.user_id }] }).populate({
            path:"user1",
            model: "User",
            match:{"_id":{$ne:msg.user_id}},
            select: 'first_name last_name user_name user_image'
        }).populate({
            path:"user2",
            model: "User",
            match:{"_id":{$ne:msg.user_id}},
            select: 'first_name last_name user_name user_image'
        }).populate({
            path:"message.sender",
            model:"User",
            select:'first_name'
        }).sort({"message.message_time":-1});

        if (!userConversations) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.DATA_NOT_FOUND;
            return callback(err, null);
        } else {
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(userConversations);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getConversations = getConversations;