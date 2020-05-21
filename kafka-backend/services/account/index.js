"use strict";
const { deactivateAccount } = require("./deactivateAccount");
const { activateAccount } = require("././activateAccount");
const { deleteAccount } = require("././deleteAccount");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "deactivate_account":
      deactivateAccount(msg, callback);
      break;
    case "login":
      activateAccount(msg, callback);
      break;
    case "delete_account":
      deleteAccount(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;