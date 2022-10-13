require('dotenv').config();

const textNotifications = require('./textNotifications.js');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_db');

//every hour
schedule.scheduleJob('0 * * * *', () => {
    runCronJob();
});

//failsafe: don't run too many times, in case I put asterisk instead of 0 somewhere in cron
let cnt = 0;
setInterval(() => {
    cnt = 0;
}, 1000*60*60*24);
function runCronJob() {
    console.log('running cron job, at ' + (new Date()));
    if(cnt > 15) {
        console.error('error: cnt exceeded 15 times in past 24 hours, the file has been stopped');
        process.exit();
    }
    else {
        cnt++;
        textNotifications.sendAllNotifications();
    }
}