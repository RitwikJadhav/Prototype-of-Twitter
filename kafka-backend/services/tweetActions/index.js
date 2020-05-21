"use strict";
const { postRetweet } = require("./postRetweet");
const { postLike } = require("./postLike");
const { postUnlike } = require("./postUnlike");
const { postReply } = require("./postReply");

function handle_request(msg, callback) {
    switch (msg.route) {
        case "post_retweet":
            postRetweet(msg, callback);
            break;
        case "post_like":
            postLike(msg, callback);
            break;
        case "post_unlike":
            postUnlike(msg, callback);
            break;
        case "post_replies":
            postReply(msg, callback);
            break;
    }
}

exports.handle_request = handle_request;