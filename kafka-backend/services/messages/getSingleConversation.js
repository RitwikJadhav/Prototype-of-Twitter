"use strict";
const Users = require('../../models/users');
const Conversation = require("../../models/conversations");

const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getSingleConversation = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let userConversations = await Conversation.findById(msg.conversation_id).populate({
            path:"user1",
            model: "User",
            match:{"_id":{$ne:msg.user_id}},
            select: 'first_name last_name user_name'
        }).populate({
            path:"user2",
            model: "User",
            match:{"_id":{$ne:msg.user_id}},
            select: 'first_name last_name user_name'
        }).populate({
            path:"message.sender",
            model:"User",
            select:'first_name'
        });

        response.status = STATUS_CODE.SUCCESS;
        response.data = JSON.stringify(userConversations);
        return callback(null,response);

    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getSingleConversation = getSingleConversation;