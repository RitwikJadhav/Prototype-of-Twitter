"use strict";
const Tweet = require("../../models/tweets");
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let postLike = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id);
        let tweet = await Tweet.findById(msg.tweet_id);
        if(!user || !tweet) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.DATA_NOT_FOUND;
            return callback(err, null);    
        }    
        else {
            if(tweet.likes.includes(msg.user_id)) {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.DATA_ALREADY_EXISTS;
                return callback(err, null);      
            }
            else {
                let tweet = await Tweet.findByIdAndUpdate(msg.tweet_id, {$push : { "likes" : msg.user_id}});
                let user = await Users.findByIdAndUpdate(msg.user_id, {$push : {"liked" : msg.tweet_id}});

                if(!tweet || !user) {
                    throw err;    
                }
                else {
                    response.status = STATUS_CODE.CREATED_SUCCESSFULLY;
                    response.data = MESSAGES.SUCCESS;
                    return callback(null, response);
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
exports.postLike = postLike;