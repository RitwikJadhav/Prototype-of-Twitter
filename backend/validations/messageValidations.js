"use strict";
const Joi = require("joi");

//Validation for Message API
function validateMessage(message) {
  const schema = {
    sender_id: Joi.string().required(),
    receiver_id: Joi.string().required(),
    message_content: Joi.string().required(),
    conversation_id: Joi.string(),
    route: Joi.string()
  };

  return Joi.validate(message, schema);
}

exports.validateMessage = validateMessage;
