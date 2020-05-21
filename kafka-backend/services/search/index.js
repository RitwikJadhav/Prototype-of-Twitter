"use strict";
const { searchUsers } = require("./searchUsers");
const { searchTweets } = require("./searchTweets");

let handle_request = (msg, callback) => {
    switch (msg.route) {
        case "search_users":
            searchUsers(msg, callback);
            break;
        case "search_tweets":
            searchTweets(msg, callback);
            break;
    }
};

exports.handle_request = handle_request;