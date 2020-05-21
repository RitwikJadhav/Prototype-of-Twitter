"use strict";
const Joi = require("joi");

//Validation for Profile API
function validatePassword(user) {
  const schema = {
    user_id: Joi.string().required(),
    password: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

exports.validatePassword = validatePassword;
