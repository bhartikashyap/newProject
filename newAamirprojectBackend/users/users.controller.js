﻿const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');

// routes
router.post('/login', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.put('/reset-password',authorize(), updateSchema, update);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then((user) => {
            console.log(user)
            res.json({ message: 'Login successful' ,
            data:user
        })
     })
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        status: Joi.string().required(),
        nationality:Joi.string().required()
    });
    console.log(req)
    validateRequest(req, next, schema);
}

function register(req, res, next) {

    userService.create(req.body)
        .then((user) => {
            console.log(user)
            res.json({ message: 'Registration successful' ,
            data:user
        })
        })
        .catch(next);
}


function updateSchema(req, res, next) {
    const schema = Joi.object({
        newpassword: Joi.string().min(6).empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.body, req.user)
        .then(user => res.json({ message: 'Password updated successfully' }))
        .catch(next);
}