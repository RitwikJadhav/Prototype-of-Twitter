"use strict";
const Users = require('../../models/users');
const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let getProfileViewsDaily = async (msg, callback) => {
    let response = {};
    let err = {};
    let profileViewsDaily = new Array();
    try {
        let user = await Users.findById(msg.user_id, { first_name: 1, last_name: 1, user_name: 1, profile_views: 1 });
        if (!user || !user.profile_views) {
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(profileViewsDaily);
            return callback(null, response);
        }
        else {
            let profile_views = user.profile_views;
            let now = new Date();
            let endDay = now;
            for (let dayIndex = 1; dayIndex <= 30; dayIndex++) {
                let startDay = new Date();
                startDay.setDate(now.getDate() - dayIndex);
                let dailyViews = profile_views.filter(e => (e > startDay && e < endDay));
                endDay = startDay;
                profileViewsDaily[dayIndex - 1] = dailyViews.length;
            }
            profileViewsDaily = profileViewsDaily.reverse();
            response.status = STATUS_CODE.SUCCESS;
            response.data = JSON.stringify(profileViewsDaily);
            return callback(null, response);
        }
    } catch (error) {
        console.log(error);
        err.status = STATUS_CODE.INTERNAL_SERVER_ERROR;
        err.data = MESSAGES.INTERNAL_SERVER_ERROR;
        return callback(err, null);
    }
};

exports.getProfileViewsDaily = getProfileViewsDaily;