"use strict";
const Joi = require("joi");

//Validation for Profile API
function validateProfile(user) {
  const schema = {
    user_id: Joi.string().required(),
    user_name: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email_id: Joi.string().email().required(),
    user_image: Joi.string(),
    user_bio: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip_code: Joi.string(),
    route: Joi.string()
  };

  return Joi.validate(user, schema);
}

exports.validateProfile = validateProfile;
