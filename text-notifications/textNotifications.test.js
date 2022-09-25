require('dotenv').config();

//mock nodemailer to not send any emails
const sendMailMock = jest.fn();
jest.mock('nodemailer');
import nodemailer from 'nodemailer';
nodemailer.createTransport.mockReturnValue({
    sendMail: sendMailMock,
    verify: (callback) => {},
});

const mongoose = require('mongoose');
const textNotifications = require('./textNotifications.js');
const synergy = require('../synergy.js');
const User = require('../db/User.js');

beforeAll(() => {
    mongoose.connect('mongodb://localhost:27017/mosachi_rewrite_test_db');
});
afterAll(() => {
    mongoose.disconnect();
});

//this test hard-codes an assignment change, so it will fail if gradebook changes
//if gradebook changes, just change the hardcoded assignment index to reference the same assignment as before
test('text notifications: create user and send notifications', async () => {
    await User.deleteMany({});

    let username = process.env.TEST_USERNAME;
    let password = process.env.TEST_PASSWORD;
    let urlSubdomain = process.env.TEST_URLSUBDOMAIN;
    let mmsEmail = process.env.TEST_MMSEMAIL;
    let gradebook = await synergy.getGradebook(username, password, urlSubdomain);
    if(gradebook == synergy.INVALID_CREDENTIALS_STR) {
        fail('invalid credentials');
    }
    else {
        //for testing, change 1 assignment
        gradebook[0].assignments[2].pointsEarned = 4;

        let user = await textNotifications.createUser(username, password, urlSubdomain, mmsEmail, gradebook);
        expect(user.username).toBe(username);
        expect(user.password).toBeDefined();
        expect(user.urlSubdomain).toBe(urlSubdomain);
        expect(user.mmsEmail).toBe(mmsEmail);
        expect(user.gradebook).toBe(JSON.stringify(gradebook));
        expect(await User.countDocuments()).toBe(1);

        sendMailMock.mockClear();
        await textNotifications.sendAllNotifications();
        expect(sendMailMock.mock.calls.length).toBe(1);
        expect(sendMailMock.mock.calls[0][0]).toEqual({
            from: 'mosachiofficial@gmail.com',
            to: mmsEmail,
            text: 'Score changed: FRQ poetry #2 thesis',
        });
    }
});