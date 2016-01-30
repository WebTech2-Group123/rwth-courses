'use strict';

var db = require('./db').getInstance();
var express = require('express');

// create router
var router = express.Router();

// welcome page
router.route('/').get(function (req, res) {
    res.send('Welcome in our amazing APIs!');
});

// semester API
router.route('/semesters').get(function (req, res) {

    db.getSemesters().then(function (semesters) {
        res.send(semesters);
    })
});

// fields APIs
router.route('/fields').get(function (req, res) {

    db.getStudyFields().then(function (fields) {
        res.send(fields);
    })
});

// courses API
router.route('/courses').get(function (req, res) {

    // get parameters
    var parameters = req.query;

    //get courses from db that match client's parameters
    db.getCourses(parameters).then(function (courses) {
        res.send(courses);
    })
});

// export the module
module.exports = router;