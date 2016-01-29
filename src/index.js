var express = require('express');
var mongo = require('./mongo');

var app = express();
mongo.createClient().then(
    function(db){
        app.get('/api/v1/courses/', function(req, res){

            // get parameters
            var parameters = req.query;

            //get courses from db that match client's parameters
            db.getCourses(parameters).then(function(courses){
                res.send(courses);
            })
        });
        app.listen(8000);
});
