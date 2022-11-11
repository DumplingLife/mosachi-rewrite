const encrypter = require('./encrypter.js');
const synergy = require('../synergy.js');
const diffGradebooks = require('./diffGradebooks.js');
const User = require('../db/User.js');

const nodemailer = require('nodemailer');

//if # updates exceeds this, don't send any text
const MAX_ASSIGNMENT_UPDATES = 5;

/*
//for some reason this doesn't work anymore
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mosachiofficial@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD,
    }
});
*/

let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

//verify login is correct
transporter.verify((err) => {
    if(err) console.log(err);
});


async function createUser(username, password, urlSubdomain, mmsEmail, gradebookObj) {
    let encryptedPassword;
    //if encrypt fails, most likely forgot to set .env, see encrypter file for details
    try {
        encryptedPassword = encrypter.encrypt(password);
    } catch(err) {
        console.error(err);
        return null;
    }

    //delete old user, in case they sign up again
    await deleteUser(username, urlSubdomain);
    
    let user = new User({
        username: username,
        password: encryptedPassword,
        urlSubdomain: urlSubdomain,
        mmsEmail: mmsEmail,
        gradebook: JSON.stringify(gradebookObj),
    });
    await user.save();
    return user;
}
//username + urlSubdomain uniquely identifies someone, username alone is not enough
async function deleteUser(username, urlSubdomain) {
    let res = await User.deleteMany({username: username, urlSubdomain: urlSubdomain});
    console.log(`deleted ${res.deletedCount} users`);
    return res.deletedCount;
}

//send all notifications and update users to match new gradebook
async function sendAllNotifications() {
    await User.find({}).then((users) => {
        let promises = [];
        for(let user of users) {
            //if error, continue with rest of users
            try {
                promises.push(getNotificationAndUpdateUser(user));
            } catch(error) {
                console.error(error);
            }
        }
        return Promise.allSettled(promises);
    });
}
async function getNotificationAndUpdateUser(user) {
    let password = encrypter.decrypt(user.password);
    let oldGradebook = JSON.parse(user.gradebook);

    let currGradebook = await synergy.getGradebook(user.username, password, user.urlSubdomain);

    let assignmentUpdates = diffGradebooks.diffGradebooks(oldGradebook, currGradebook);
    if(assignmentUpdates.length == 0) return;
    else if(assignmentUpdates >= MAX_ASSIGNMENT_UPDATES) return;
    else {
        //temporary: disable for AT&T
        if(user.mmsEmail.includes('mms.att.net')) return;

        //generate text message
        let text = '';
        let assignmentUpdateTexts = [];
        for(let assignmentUpdate of assignmentUpdates) {
            if(assignmentUpdate.diffType == diffGradebooks.ASSIGNMENT_DIFF_TYPE_NEW_ASSIGNMENT) {
                assignmentUpdateTexts.push(`New assignment: ${assignmentUpdate.newAssignment.name}`);
            }
            else if(assignmentUpdate.diffType == diffGradebooks.ASSIGNMENT_DIFF_TYPE_POINTS_CHANGE) {
                assignmentUpdateTexts.push(`Score changed: ${assignmentUpdate.newAssignment.name}`);
            }
            else {
                console.error('assignment update type is not recognized');
            }
        }
        text += assignmentUpdateTexts.join('\n');

        let promises = [];
        promises.push(sendText(user.mmsEmail, text));

        //update in mongodb
        user.gradebook = JSON.stringify(currGradebook);
        promises.push(user.save());
        await Promise.allSettled(promises);
    }
}
async function sendText(mmsEmail, text) {
    console.log(`sending notification to ${mmsEmail}:`);
    console.log(text);
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: mmsEmail,
            text: text,
        });
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    sendAllNotifications: sendAllNotifications,
    sendText: sendText,
};