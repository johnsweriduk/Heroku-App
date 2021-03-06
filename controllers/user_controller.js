const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();
const User = require('../models/user.js');

users.get('/new', (req, res) => {
    if(req.session.counter == 0) {
        req.session.message = '';
    } else if(req.session.counter > 0) {
        req.session.counter--;
    }
    res.render('users/new.ejs', {
        message: req.session.message,
        currentUser: req.session.currentUser
    });
});

users.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.create(req.body, (err, createdUser) => {
        if(err) {
            req.session.message = 'Username already taken. Please choose another.';
            req.session.counter = 1;
            res.send({error: 1});
        } else {
            console.log('user is created', createdUser);
            req.session.message = '';
            req.session.counter = 0;
            res.send({user: createdUser.username});
        }
    })
});


users.delete('/', (req, res) => {
   User.findOne({username: req.session.currentUser.username}, (err, user) => {
       user.remove();
       req.session.destroy();
       res.sendStatus(200);
   });
});
module.exports = users;