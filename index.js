require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const synergy = require('./synergy.js');

const PORT = 3000;

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    cookie: {},
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//backend (api) routes
app.post('/login', (req, res) => {
    synergy.getGradebook(req.body.username, req.body.password, req.body.urlSubdomain).then((gradebook) => {
        if(gradebook == synergy.INVALID_CREDENTIALS_STR) res.redirect('/login?loginFailed=true');
        else {
            req.session.gradebook = gradebook;
            //loggedIn is just a convenient way to do redirects, no security concern here
            req.session.loggedIn = true;
            res.redirect('/periods');
        }
    });
});
app.post('/logout', (req, res) => {
    req.session.destroy();
});
app.get('/get-gradebook', (req, res) => {
    res.json(req.session.gradebook);
});

//frontend routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'main.html'));
});
app.get(['/periods', '/periods/:id'], (req, res) => {
    if(!req.session.loggedIn) res.redirect('/login');
    else res.sendFile(path.join(__dirname, 'frontend', 'public', 'main.html'));
});
app.use(express.static(path.join(__dirname, 'frontend', 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'landing.html'));
});

//catchall redirect
app.get('*', (req, res) => {
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});