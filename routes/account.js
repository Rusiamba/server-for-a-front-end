const express = require('express');
const router = express.Router();
const User =  require('../models/user');
const passport = require('passport');
const config = require('../config/db');

// router.get('/reg', (req, res) => {
//     res.send('Register page');
// });

router.post ('/reg', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (user) {
            res.json({success: false, msg: "User don't was added"});
        } else if (err) {
            res.json({success: true, msg: "User was added"});
        }            
    });
});

router.post('/auth', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    User.getUserByLogin(login, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "This user don't was finded"});
        }
    });

    User.comparePass(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 3600 * 24
            });

            res.json({
                success: true,
                token: 'JWT ' + token,
                user: {
                    id: user._id,
                    name: user._name,
                    login: user.login,
                    email: user._email
                }
            });
        } 
        else {
            return res.json({success: false, msg: "Passwords don't confirm"})
        }
    });
});

router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('User page');
});

module.exports = router;