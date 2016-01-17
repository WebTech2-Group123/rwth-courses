'use strict';

var MongoClient = require('mongodb').MongoClient;
var log = require('debug')('db');
var assert = require('assert');

// constructor
var Mongo = function (url) {
    this.url = url || process.env.MONGODB_URL || 'mongodb://localhost:27017/rwth-courses';
};

// insert course
Mongo.prototype.connect = function () {

    // use connect method to connect to the Server
    MongoClient.connect(this.url, (err, db) => {
        assert.equal(null, err);
        log('Connected to MongoDB');
        this.db = db;
    });

    // disconnect on programm exit
    process.on('SIGINT', () => {
        this.db.close();
        log('Disconnected from MongoDB');
    });
};



// export
exports.Mongo = Mongo;
exports.createClient = function(url) {
    var db = new Mongo(url);
    db.connect();
    return db;
};