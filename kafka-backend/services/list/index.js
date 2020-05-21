"use strict";
const { createList } = require("./createList");
const { getUserLists } = require("./getUserLists");
const { updateList } = require("./updateList");
const { deleteList } = require("./deleteList");
const { addToList } = require("./addToList");
const { removeFromList } = require("./removeFromList");
const { getListUsers } = require("./getListUsers");
const { getMemberTweets } = require("./getMemberTweets");
const { getList } = require("./getList");

function handle_request(msg, callback) {
    console.log("inside index of list");
    switch (msg.route) {
        case "create_list":
            createList(msg, callback);
            break;
        case "get_user_lists":
            getUserLists(msg, callback);
            break;
        case "update_list":
            updateList(msg, callback);
            break;
        case "delete_list":
            deleteList(msg, callback);
            break;
        case "add_to_list":
            addToList(msg, callback);
            break;
        case "remove_from_list":
            removeFromList(msg, callback);
            break;
        case "get_list_users":
            getListUsers(msg, callback);
            break;
        case "get_member_tweets":
            getMemberTweets(msg, callback);
            break;
        case "get_list":
            getList(msg, callback);
            break;
    }
}

exports.handle_request = handle_request;