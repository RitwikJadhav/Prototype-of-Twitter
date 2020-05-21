"use strict";
const Users = require('../../models/users');
const Conversation = require("../../models/conversations");

const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getSearchedConversation = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id);
        if (!user) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.DATA_NOT_FOUND;
            return callback(err, null);
        }
        let userConversations = await Conversation.find({ $and: [{ $or: [{ "user1": msg.user_id }, { "user1": msg.target_id }] }, { $or: [{ "user2": msg.user_id }, { "user2": msg.target_id }] }] });
        if (!userConversations) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.DATA_NOT_FOUND;
            return callback(err, null);
        }else{
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(userConversations);
            return callback(null, response);
        }
    } catch (error) {
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getSearchedConversation = getSearchedConversation;