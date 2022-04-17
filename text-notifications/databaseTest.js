require('dotenv').config();

const mongoose = require('mongoose');
const textNotifications = require('./textNotifications.js');
const synergy = require('../synergy.js');
const User = require('../db/User.js');

mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_db');

/*
createTestUser().then((user) => {
    console.log('test user created');
    textNotifications.sendAllNotifications().then(() => {
        console.log('send notifs finished');
        console.log('disconnecting from mongo...');
        mongoose.disconnect();
    });
});
*/

textNotifications.sendAllNotifications().then(() => {
    console.log('send notifs finished');
    console.log('disconnecting from mongo...');
    mongoose.disconnect();
});

async function createTestUser() {
    let username = 's-chengji';
    let password = 's#1008071';
    let urlSubdomain = 'wa-bsd405-psv';
    let mmsEmail = '4253010556@mms.att.net';

    let gradebook = await synergy.getGradebook(username, password, urlSubdomain);

    if(gradebook == synergy.INVALID_CREDENTIALS_STR) console.log('invalid credentials');
    else {
        //for testing, change 1 assignment
        gradebook[0].assignments[2].pointsEarned = 4;

        return textNotifications.createUser(username, password, urlSubdomain, mmsEmail, gradebook);
    }
}