var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;
var ROOT_URL = "localhost:3001";

it("Get tweets by pagination should be successful", function (done) {
    chai.request(ROOT_URL)
        .get('/api/tweets/user/5de17a027af3c818ccee88fc/1')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get tweets of all users that are followed by given user", function (done) {
    chai.request(ROOT_URL)
        .get('/api/tweets/following/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get all the tweets liked by user", function (done) {
    chai.request(ROOT_URL)
        .get('/api/tweets/liked/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get profile details of user", function (done) {
    chai.request(ROOT_URL)
        .get('/api/profile/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get user's top 10 tweets by views", function (done) {
    chai.request(ROOT_URL)
        .get('/api/analytics/topViewedTweets/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get user's top 10 tweets by likes", function (done) {
    chai.request(ROOT_URL)
        .get('/api/analytics/topLikedTweets/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get user's top 10 tweets by retweets", function (done) {
    chai.request(ROOT_URL)
        .get('/api/analytics/topRetweetedTweets/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get Tweet count hourly", function (done) {
    chai.request(ROOT_URL)
        .get('/api/analytics/tweetCountHourly/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get user's followers", function (done) {
    chai.request(ROOT_URL)
        .get('/api/follow/followers/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});

it("Get user's messages", function (done) {
    chai.request(ROOT_URL)
        .get('/api/message/5de17a027af3c818ccee88fc')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
});