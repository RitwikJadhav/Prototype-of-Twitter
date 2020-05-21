"use strict";
const Users = require('../../models/users');
const Conversation = require("../../models/conversations");

const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let sendMessage = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let newMessage = {
            sender: msg.sender_id,
            message_content: msg.message_content,
            message_time: Date.now()
        }

        if (msg.conversation_id) {
            let existingConversation = await Conversation.findById(msg.conversation_id);
            if (!existingConversation) {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.DATA_NOT_FOUND;
                return callback(err, null);
            }

            existingConversation.message.push(newMessage);
            let conversationUpdate = await existingConversation.save({new: true});

            if (conversationUpdate) {
                response.status = STATUS_CODE.CREATED_SUCCESSFULLY;
                response.data = conversationUpdate;
                return callback(null, response);
            } else {
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.ACTION_NOT_COMPLETE;
                return callback(err, null);
            }

        }
        else {
            let user1 = Users.findById(msg.sender_id);
            let user2 = Users.findById(msg.receiver_id);

            if (!user1 || !user2) {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.INVALID_INPUTS;
                return callback(err, null);
            }

            let newConversation = new Conversation({
                user1: msg.sender_id,
                user2: msg.receiver_id,
                message: newMessage,
            })

            const convSave = await newConversation.save({new: true});

            if (convSave) {
                response.status = STATUS_CODE.CREATED_SUCCESSFULLY;
                response.data = convSave;
                return callback(null, response);
            } else {
                err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
                err.data = MESSAGES.INTERNAL_SERVER_ERROR;
                return callback(err, null);
            }
        }

    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.sendMessage = sendMessage;