'use strict';

var express = require('express');
var api = require('./api');

// create express app
var app = express();

// serve the public directory
app.use('/', express.static(__dirname + '/../client'));

// serve client side JS
// TODO: make it better
app.use('/lib', express.static(__dirname + '/../node_modules'));

// serve the APIs
api.getRouter().then(router => {
    app.use('/api', router);
});

// run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});