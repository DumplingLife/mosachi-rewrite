require('dotenv').config();

const textNotifications = require('./textNotifications.js');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_db');

//cron jobs (multiple because there is no way to specify multiple times each day)
//start of each period and 4:00PM
//8:00
schedule.scheduleJob('0 0 8 * * *', () => {
    runCronJob();
});
//8:55
schedule.scheduleJob('0 55 8 * * *', () => {
    runCronJob();
});
//9:55
schedule.scheduleJob('0 55 9 * * *', () => {
    runCronJob();
});
//10:50
schedule.scheduleJob('0 50 10 * * *', () => {
    runCronJob();
});
//11:45
schedule.scheduleJob('0 45 11 * * *', () => {
    runCronJob();
});
//12:20
schedule.scheduleJob('0 15 12 * * *', () => {
    runCronJob();
});
//1:15
schedule.scheduleJob('0 15 13 * * *', () => {
    runCronJob();
});
//2:10
schedule.scheduleJob('0 10 14 * * *', () => {
    runCronJob();
});
//4:00
schedule.scheduleJob('0 0 16 * * *', () => {
    runCronJob();
});

//failsafe: don't run too many times, in case I put asterisk instead of 0 somewhere in cron
let cnt = 0;
setInterval(() => {
    cnt = 0;
}, 1000*60*60*24);
function runCronJob() {
    console.log('running cron job, at ' + Date.now());
    if(cnt > 15) {
        console.error('error: cnt exceeded 15 times in past 24 hours, the file has been stopped');
        process.exit();
    }
    else {
        cnt++;
        textNotifications.sendAllNotifications();
    }
}