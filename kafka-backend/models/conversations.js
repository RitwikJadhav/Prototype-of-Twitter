"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const messages = {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    message_content: {
        type: String,
        trim: true
    },
    message_time: {
        type: Date,
        required: true
    }
};

//Schema
const conversationSchema = new schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        message: [messages]
    },
    { versionKey: false }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;