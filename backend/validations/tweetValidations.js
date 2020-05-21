const Joi = require("joi");

//Validation for Tweet API
function validateTweet(user) {
    const schema = {
        user_id: Joi.string().required(),
        tweet_text: Joi.string(),
        hashtags: Joi.string(),
        route: Joi.string()
    };

    return Joi.validate(user, schema);
}

//Validation for Likes of Tweets
function validateLikes(likes) {
    const schema = {
        user_id: Joi.string().required(),
        tweet_id: Joi.string().required(),
        route: Joi.string()
    };

    return Joi.validate(likes, schema);
}

function validateReplies(replies) {
    const schema = {
        user_id: Joi.string().required(),
        tweet_id: Joi.string().required(),
        reply_text: Joi.string().required(),
        route: Joi.string()
    };

    return Joi.validate(replies, schema);
}

exports.validateReplies = validateReplies;
exports.validateLikes = validateLikes;
exports.validateTweet = validateTweet;
