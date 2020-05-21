"use strict";
const Joi = require("joi");

//Validation for Bookmarks API
function validateBookmark(bookmark) {
  const schema = {
    user_id: Joi.string().required(),
    tweet_id: Joi.string().required(),
    route: Joi.string()
  };

  return Joi.validate(bookmark, schema);
}

function validateClearBookmark(bookmark) {
  const schema = {
    user_id: Joi.string().required(),
    route: Joi.string()
  };

  return Joi.validate(bookmark, schema);
}

exports.validateBookmark = validateBookmark;
exports.validateClearBookmark = validateClearBookmark;
