var MongoClient = require('mongodb').MongoClient;
var log = require('debug')('db');
var assert = require('assert');

// connection URL
var url = process.env.MONGODB_URL || 'mongodb://localhost:27017/rwth-courses';

// store db object
var mongo;

// cse connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    log('Connected to MongoDB');
    mongo = db;
});

// disconnect on programm exit
process.on('SIGINT', function () {
    mongo.close();
    log('Disconnected from MongoDB');
});

//