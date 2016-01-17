'use strict';

// TODO: events / promises???

// mongo
var MongoClient = require('mongodb').MongoClient;
var Promise = require("bluebird");
Promise.promisifyAll(require("mongodb"));

// logs
var log = require('debug')('db');
var assert = require('assert');

// constants
const COURSES = 'courses';
const COURSES_TEMP = 'courses_temp';

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

        // save db instance
        this.db = db;

        // create courses collection
        db.createCollectionAsync(COURSES).then(collection => {
            this.courses = collection;
        });

        // create courses_temp collection
        db.createCollectionAsync(COURSES_TEMP).then(collection => {
            this.coursesTemp = collection;
        });
    });

    // disconnect on programm exit
    process.on('SIGINT', () => {
        this.db.close();
        log('Disconnected from MongoDB');
    });
};

// drop temp_courses collection
Mongo.prototype.renameTempCourses = function () {
    return this.coursesTemp.renameAsync(COURSES, {dropTarget: true}).then(() => {
        log('Rename ' + COURSES_TEMP + ' to ' + COURSES);
    });
};

// export
exports.Mongo = Mongo;
exports.createClient = function (url) {
    var db = new Mongo(url);
    db.connect();
    return db;
};