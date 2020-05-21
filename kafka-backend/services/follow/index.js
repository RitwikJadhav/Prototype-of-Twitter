"use strict";
const { followUser } = require("./followUser");
const { unfollowUser } = require("./unfollowUser");
const { getFollowing } = require("./getFollowing");
const { getFollowers } = require("./getFollowers");
const { getUsersToFollow } = require("./getUsersToFollow");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "follow_user":
      followUser(msg, callback);
      break;
    case "unfollow_user":
      unfollowUser(msg, callback);
      break;
    case "get_following":
      getFollowing(msg, callback);
      break;
    case "get_followers":
      getFollowers(msg, callback);
      break;
    case "get_users_to_follow":
      getUsersToFollow(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;