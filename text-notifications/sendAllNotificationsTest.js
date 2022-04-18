require('dotenv').config();

const mongoose = require('mongoose');
const textNotifications = require('./textNotifications.js');

mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_db');

textNotifications.sendAllNotifications().then(() => {
    console.log('send notifs finished');
    console.log('disconnecting from mongo...');
    mongoose.disconnect();
});

