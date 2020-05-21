const Joi = require("joi");

//Validation for User Signup API
function validateCreateList(user) {
    const schema = {
        list_owner: Joi.string().required(),
        list_name: Joi.string().required(),
        list_description: Joi.string().required(),
        route: Joi.string()
    };
    return Joi.validate(user, schema);
}

function validateUpdateList(user) {
    const schema = {
        list_owner: Joi.string().required(),
        list_id: Joi.string().required(),
        list_name: Joi.string(),
        list_description: Joi.string(),
        route: Joi.string()
    };
    return Joi.validate(user, schema);
}

function validateDeleteList(user) {
    const schema = {
        list_id: Joi.string().required(),
        list_owner: Joi.string().required(),
        route: Joi.string()
    };
    return Joi.validate(user, schema);
}

function validateAddToList(user) {
    const schema = {
        list_id: Joi.string().required(),
        user_id: Joi.string().required(),
        type: Joi.string().required(),
        route: Joi.string()
    };
    return Joi.validate(user, schema);
}

function validateRemoveFromList(user) {
    const schema = {
        list_id: Joi.string().required(),
        user_id: Joi.string().required(),
        type: Joi.string().required(),
        route: Joi.string()
    };
    return Joi.validate(user, schema);
}


exports.validateCreateList = validateCreateList;
exports.validateUpdateList = validateUpdateList;
exports.validateDeleteList = validateDeleteList;
exports.validateAddToList = validateAddToList;
exports.validateRemoveFromList = validateRemoveFromList;