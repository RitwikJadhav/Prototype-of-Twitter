"use strict";
const config = {
   secret: "cmpe273_kafka_passport_mongo",
   frontendURI: "http://localhost:3000",
   kafkaURI: "localhost:2181",
   mysqlUser: "root",
   mysqlPassword: "cmpepassword",
   mysqlHost: "cmpedatabase.cxwydwkipclw.us-east-1.rds.amazonaws.com",
   mysqlDatabase: "twitter",
   awsBucket: "cmpe273twitter",
   // Keys can't be added here because AWS categorizes this as vulnerability.
   awsAccessKey: "AKIAIGYDUOPCKMVQ57WA",
   awsSecretAccessKey: "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",
   awsPermission: "public-read"
};

module.exports = config;