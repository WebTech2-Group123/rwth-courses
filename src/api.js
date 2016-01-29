'use strict';

var mongo = require('./mongo');
var express = require('express');

function getRouter() {

    // create router
    var router = express.Router();

    // welcome page
    router.route('/').get(function (req, res) {
        res.send('Welcome in our amazing APIs!');
    });

    // connect to DB
    return mongo.createClient().then(function (db) {
        // semester API
        router.route('/semesters').get(function (req, res) {

            db.getSemesters().then(function (semesters) {
                res.send(semesters);
            })
        });

        // fields APIs

        // courses API
        router.route('/courses').get(function (req, res) {

            // get parameters
            var parameters = req.query;

            //get courses from db that match client's parameters
            db.getCourses(parameters).then(function (courses) {
                res.send(courses);
            })
        });

        // return the router
        return router;
    });
}

// export the module
exports.getRouter = getRouter;