const encrypter = require('./encrypter.js');
const synergy = require('../synergy.js');
const diffGradebooks = require('./diffGradebooks.js');
const User = require('../db/User.js');

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mosachiofficial@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD,
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
async function deleteUser(username) {

}

//send all notifications and update users to match new gradebook
async function sendAllNotifications() {
    await User.find({}).then((users) => {
        let promises = [];
        for(let user of users) {
            promises.push(getNotificationAndUpdateUser(user));
        }
        return Promise.allSettled(promises);
    });
    return;
}
async function getNotificationAndUpdateUser(user) {
    let password = encrypter.decrypt(user.password);
    let oldGradebook = JSON.parse(user.gradebook);

    let currGradebook = await synergy.getGradebook(user.username, password, user.urlSubdomain);

    let assignmentUpdates = diffGradebooks.diffGradebooks(oldGradebook, currGradebook);
    if(assignmentUpdates.length == 0) return;
    else {
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
        console.log(`sending notification to ${user.mmsEmail}`);
        console.log(text);

        let promises = [];
        promises.push(transporter.sendMail({
            from: 'mosachiofficial@gmail.com',
            to: user.mmsEmail,
            text: text,
        }, (err) => {
            if(err) console.error(err);
        }));

        //update in mongodb
        user.gradebook = JSON.stringify(currGradebook);
        promises.push(user.save());
        await Promise.allSettled(promises);
        return;
    }
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    sendAllNotifications: sendAllNotifications,
};