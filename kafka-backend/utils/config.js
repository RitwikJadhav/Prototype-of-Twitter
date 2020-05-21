"use strict";
module.exports = {
  mongoDBURI: "mongodb+srv://admin:CMPE273@twitter-ftl7l.mongodb.net/twitter?retryWrites=true&w=majority",
  kafkaURI: "localhost:2181",
  // This is AWS Redis instance. Connect to this if you don't want to connect to local Redis
  redisHost: "54.173.125.207",
  // redisHost: "localhost",
  redisPort: 6379
};
