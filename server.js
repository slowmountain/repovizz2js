const express = require('express');
const passport = require('passport');
const request = require('request');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var access_token = "";

passport.use('repovizz2', new OAuth2Strategy({
        authorizationURL: 'https://repovizz2.upf.edu/oauth/authorize',
        tokenURL: 'https://repovizz2.upf.edu/oauth/token',
        clientID: 'f449d9b5-dd56-4f00-a9b6-eebe8d1d877a',
        clientSecret: '0d0e70dc-3986-4632-8a98-e350adffaa27',
        callbackURL: 'http://localhost:3000/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        access_token = accessToken;
        done(null, {
            accessToken: accessToken
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const app = express();
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

app.get('/auth/provider', passport.authenticate('repovizz2', { scope: 'basic'}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/me', (req, res) => {
    request.get('https://repovizz2.upf.edu/api/v1.0/user', function(err, response, body) {
        if(err){
            console.log("error")
        }
        else {
            var profile = JSON.parse(body);
            console.log(response.statusCode);
            console.log(body);
            res.render('me',profile);
        }
    })
    .auth(null, null, true, access_token);
});

app.listen(3000, () => {
    console.log('Express server started on port 3000'); // eslint-disable-line
});

app.get('/callback',
    passport.authenticate('repovizz2', { successRedirect: '/me',
        failureRedirect: '/' }));