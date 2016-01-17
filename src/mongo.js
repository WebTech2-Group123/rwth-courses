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
    return MongoClient.connectAsync(this.url).then(db => {
        log('Connected to MongoDB');

        // save db instance
        this.db = db;

        // register handler to clean up connections
        // disconnect on programm exit
        process.on('SIGINT', () => {
            this.db.close();
            log('Disconnected from MongoDB');
        });

        // create courses collection
        db.createCollectionAsync(COURSES).then(collection => {
            this.courses = collection;
        });

        // create courses_temp collection
        db.createCollectionAsync(COURSES_TEMP).then(collection => {
            this.coursesTemp = collection;
        });

        return this;
    });
};

// drop db (for tests only)
Mongo.prototype._drop = function () {
    return this.db.dropDatabaseAsync().then(() => {
        log('WARNING: drop database!');
    });
};

// drop temp_courses collection
Mongo.prototype.renameTempCourses = function () {
    return this.coursesTemp.renameAsync(COURSES, {dropTarget: true}).then(() => {
        log('Rename ' + COURSES_TEMP + ' to ' + COURSES);
    });
};

// insert a course
Mongo.prototype.insertCourse = function (course) {
    return this.coursesTemp.insertOne(course).then(count => {
        if (count == 0) {
            log('Skip course with id: ' + course.general.gguid);
        } else {
            log('Insert course id: ' + course.general.gguid);
        }
        return count;
    });
};

// export
exports.Mongo = Mongo;
exports.createClient = function (url) {
    var db = new Mongo(url);
    return db.connect();
};