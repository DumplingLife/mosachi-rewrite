require('dotenv').config();

const textNotifications = require('./textNotifications.js');
const schedule = require('node-schedule');

//cron jobs (multiple because there is no way to specify multiple times each day)
//8:00
schedule.scheduleJob('0 0 8 * * *', () => {
    runCronJob();
});

//1 min 30 sec before each period ends, other than 5a
//8:48:30
schedule.scheduleJob('30 48 8 * * *', () => {
    runCronJob();
});
//9:48:30
schedule.scheduleJob('30 48 9 * * *', () => {
    runCronJob();
});
//10:43:30
schedule.scheduleJob('30 43 10 * * *', () => {
    runCronJob();
});
//11:38:30
schedule.scheduleJob('30 38 11 * * *', () => {
    runCronJob();
});
//1:08:30
schedule.scheduleJob('30 08 13 * * *', () => {
    runCronJob();
});
//2:03:30
schedule.scheduleJob('30 03 14 * * *', () => {
    runCronJob();
});
//2:58:30
schedule.scheduleJob('30 58 14 * * *', () => {
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
    console.log('running cron job');
    if(cnt > 15) {
        console.error('error: cnt exceeded 15 times in past 24 hours, the file has been stopped');
        process.exit();
    }
    else {
        cnt++;
        textNotifications.sendAllNotifications();
    }
}