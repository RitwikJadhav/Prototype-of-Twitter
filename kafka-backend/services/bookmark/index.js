"use strict";
const { addBookmark } = require("./addBookmark");
const { getBookmarks } = require("./getBookmarks");
const { deleteBookmark } = require("./deleteBookmark");
const { clearBookmarks } = require("./clearBookmarks");


let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "add_bookmark":
      addBookmark(msg, callback);
      break;
    case "get_bookmarks":
      getBookmarks(msg, callback);
      break;
    case "delete_bookmark":
      deleteBookmark(msg, callback);
      break;
    case "clear_bookmarks":
      clearBookmarks(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;