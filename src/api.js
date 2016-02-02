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
        res.json(semesters);
    })
});

// fields APIs
router.route('/fields').get(function (req, res) {

    db.getStudyFields().then(function (fields) {
        res.json(fields);
    })
});

// courses API
router.route('/courses').get(function (req, res) {

    // get parameters
    var query = req.query;

    // object to resolve
    var promise;

    // check if ids passed
    if (typeof query.ids !== 'undefined') {
        let ids = query.ids.split(',');
        promise = db.getCoursesByIds(ids);
    }

    // ids not specified... use other parameters
    else {

        // filter object to pass to the db
        let filter = {};

        // select only allowed parameters
        const allowed = ['semester', 'field', 'language'];
        allowed.forEach(function (parameter) {
            if (typeof query[parameter] !== 'undefined') {
                filter[parameter] = query[parameter];
            }
        });

        promise = db.getCourses(filter);
    }

    // send the courses
    promise.then(function (courses) {
        res.json(courses);
    })
});

// export the module
module.exports = router;