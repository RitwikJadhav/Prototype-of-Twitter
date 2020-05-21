"use strict";
const Joi = require("joi");

//Validation for User Signup API
function validateUser(user) {
  const schema = {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    user_name: Joi.string().required(),
    email_id: Joi.string().email().required(),
    password: Joi.string().required()
  };
  return Joi.validate(user, schema);
}
exports.validateUser = validateUser;
