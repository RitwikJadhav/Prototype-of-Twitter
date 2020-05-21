"use strict";
const User = require('../../models/users');
const List = require('../../models/lists')
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

async function addToList(msg, callback) {
    let response = {};
    let err = {};
    let userUpdated, listUpdated, userTargetArray, listTargetArray, addCondition;

    try {
        let user = await User.findById(msg.user_id);
        let list = await List.findById(msg.list_id)

        if (!user || !list) {
            console.log("in user not found");
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.USER_NOT_EXIST;
            return callback(err, null);
        }
        else {
            console.log(msg.type);
            console.log(msg);
            switch (msg.type) {
                case "member":
                    userTargetArray = "membered_lists"
                    listTargetArray = "members";
                    addCondition = user.membered_lists.includes(msg.list_id) || list.members.includes(msg.user_id);
                    break;
                case "subscriber":
                    userTargetArray = "subscribed_lists";
                    listTargetArray = "subscribers";
                    addCondition = user.subscribed_lists.includes(msg.list_id) || list.subscribers.includes(msg.user_id) || list.list_owner.equals(msg.user_id);
                    break;
            }
            console.log(addCondition);
            if (!addCondition) {
                userUpdated = await User.updateOne({ _id: msg.user_id }, { $push: { [userTargetArray]: msg.list_id } });
                listUpdated = await List.updateOne({ _id: msg.list_id }, { $push: { [listTargetArray]: msg.user_id } });
                
                if (userUpdated.ok !== 1 || listUpdated.ok !== 1) {
                    err.status = STATUS_CODE.BAD_REQUEST;
                    err.data = MESSAGES.ACTION_NOT_COMPLETE;
                    return callback(err, null);
                } else {
                    response.status = STATUS_CODE.SUCCESS;
                    response.data = MESSAGES.SUCCESS;
                    return callback(null, response);
                }
            } else {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.INVALID_INPUTS;
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

exports.addToList = addToList;