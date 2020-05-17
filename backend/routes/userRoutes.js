const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const auth = require('../middleware/auth');
const authRequired = require('../middleware/authRequired');

const router = express.Router();


//for signing up
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


//for logging in
router.post('/login', async(req, res, next) => {
    try{
    let userData;
    let user = await User.findOne({ email: req.body.email });
        if(!user) {
            return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
        }

        userData = user;

        if(req.query.pass === 'no')
        {
            let result = await bcrypt.compare(req.body.password, user.password);

            if(!result) 
                return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
        }

        else if(req.query.pass === 'yes')
        {
            let result = await User.findOne({password: req.body.password});

            if(!result)
                return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
        }

        const token = jwt.sign({ email: userData.email, userId: userData._id, username: userData.username, userDp: userData.dp },
             "8d7043d23c8bf0a9b6ac01253749d34d",
             { expiresIn: "1hr" });
             
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: userData._id,
            username: userData.username,
            userDp: userData.dp
        });
    }
    catch(err) {
        return res.status(401).json({ message: "Incorrect email and/or password! Please try again." });
    }
});


//for getting user details partially for other users to view
router.get('/details/:id', async(req, res, next) => {
    try {
    const user = await User.findById(req.params.id).lean();
    const modUser = {
        _id: user._id,
        username: user.username,
        dp: user.dp
    };

    res.status(200).json(modUser);

    } catch(err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }

});


//for getting all user details(except password) for user to view their own profile
router.get('/settings/:id', async(req, res, next) => {
    try {
    const user = await User.findById(req.params.id).lean();
    const modUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        dp: user.dp
    };

    res.status(200).json(modUser);

    } catch(err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }    
});


//editting username
router.put('/username', auth, authRequired, async(req, res, next) => {
    try
    {
        if(req.body.id === req.userData.userId)
        {
            let user = await User.findOneAndUpdate({_id: req.body.id}, {username: req.body.username});
            if(user)
            {  
                let payload = {
                    username: req.body.email,
                    email: user.email,
                    password: user.password
                };
                console.log(payload);

                return res.status(200).json(payload);
            }
        }
        else
            res.status(401).json({message: 'Nice try'});
    }
    catch(err)
    {
        res.status(500).json({error: err, message: 'Username Taken! Please try another one'});
    }
});


//editting email
router.put('/email', auth, authRequired, async(req, res, next) => {
    try
    {
        if(req.body.id === req.userData.userId)
        {
            let user = await User.findOneAndUpdate({_id: req.body.id}, {email: req.body.email});
            if(user)
            {  
                let payload = {
                    username: user.username,
                    email: req.body.email,
                    password: user.password
                };

                return res.status(200).json(payload);
            }
            else
                return res.status(401).json({message: 'Unauthorized'});
        }
        else
            res.status(401).json({message: 'Nice try'});
    }
    catch(err)
    {
        res.status(500).json({error: err, message: 'Email taken! Please try another one'});
    }
});


module.exports = router;