const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then( hash => {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message: "user saved",
                user: result
            });
            }).catch(err => {
                res.status(500).json({ message: "Email and/or username already taken! Please signup with another one." });
        });
    });
});


router.post('/login', (req, res, next) => {
    let userData;
    User.findOne( { email: req.body.email } ).then(user => {
        console.log(user);
        if(!user) {
            return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
        }
        userData = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if(!result) {
            return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
        }
        const token = jwt.sign({ email: userData.email, userId: userData._id, username: userData.username },
             "8d7043d23c8bf0a9b6ac01253749d34d",
             { expiresIn: "1hr" });
             
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: userData._id,
            username: userData.username
        });
    }).catch( err => {
        return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
    });
});



module.exports = router;