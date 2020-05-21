"use strict";
const Joi = require("joi");

//Validation for User Signup API
function validateFollow(user) {
  const schema = {
    user_id: Joi.string().required(),
    target_user_id: Joi.string().required(),
    route: Joi.string()
  };
  return Joi.validate(user, schema);
}
exports.validateFollow = validateFollow;
