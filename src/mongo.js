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
        var promise1 = db.createCollectionAsync(COURSES).then(collection => {
            this.courses = collection;
            return collection.createIndexAsync('gguid', {unique: true});
        });

        // create courses_temp collection
        var promise2 = db.createCollectionAsync(COURSES_TEMP).then(collection => {
            this.coursesTemp = collection;
            return collection.createIndexAsync('gguid', {unique: true});
        });

        // return the db when everything is ready
        return Promise.all([promise1, promise2]).then(() => {
            return this;
        });
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
    return this.coursesTemp.updateOne({gguid: course.gguid}, course, {upsert: true})
        .then(result => {
            if (result.upsertedCount == 1) {
                log('Insert course with id: ' + course.gguid);
            } else {
                log('Update course with id: ' + course.gguid);
            }
            return result;
        });
};

// export
exports.Mongo = Mongo;
exports.createClient = function (url) {
    var db = new Mongo(url);
    return db.connect();
};