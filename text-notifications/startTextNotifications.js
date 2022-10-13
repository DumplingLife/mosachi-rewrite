require('dotenv').config();

const textNotifications = require('./textNotifications.js');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_db');

//every hour
schedule.scheduleJob('0 * * * *', () => {
    console.log('running cron job, at ' + (new Date()));
    textNotifications.sendAllNotifications();
});