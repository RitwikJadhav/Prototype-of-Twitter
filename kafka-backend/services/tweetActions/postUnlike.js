"use strict";
const Tweets = require("../../models/tweets");
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let postUnlike = async (msg, callback) => {
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id);
        let tweet = await Tweets.findById(msg.tweet_id);

        if(!user || !tweet) {
            err.status = STATUS_CODE.BAD_REQUEST;
            err.data = MESSAGES.DATA_NOT_FOUND;
            return callback(err, null);    
        }    
        else {
            if(!tweet.likes.includes(msg.user_id)) {
                err.status = STATUS_CODE.BAD_REQUEST;
                err.data = MESSAGES.DATA_ALREADY_EXISTS;
                return callback(err, null);      
            }
            else {
                user.liked.remove(msg.tweet_id);
                let userUpdated = await user.save();

                tweet.likes.remove(msg.user_id);
                let tweetUpdated = await tweet.save();

                if(!tweetUpdated || !userUpdated) {
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
exports.postUnlike = postUnlike;