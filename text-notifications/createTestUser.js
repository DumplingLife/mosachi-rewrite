require('dotenv').config();

const mongoose = require('mongoose');
const textNotifications = require('./textNotifications.js');
const synergy = require('../synergy.js');

mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_db');

let username = process.env.TEST_USERNAME;
let password = process.env.TEST_PASSWORD;
let urlSubdomain = process.env.TEST_URLSUBDOMAIN;
let mmsEmail = process.env.TEST_MMSEMAIL;

synergy.getGradebook(username, password, urlSubdomain).then((gradebook) => {
    if(gradebook == synergy.INVALID_CREDENTIALS_STR) console.log('invalid credentials');
    else {
        //for testing, change 1 assignment
        gradebook[1].assignments[2].pointsEarned = 4;
    
        textNotifications.createUser(username, password, urlSubdomain, mmsEmail, gradebook).then(() => {
            console.log('done');
        });
    }
});


