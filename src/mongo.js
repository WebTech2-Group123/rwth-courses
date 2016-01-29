'use strict';

// logs
var log = require('debug')('db');
var details = require('debug')('db-details');

// mongo
var MongoClient = require('mongodb').MongoClient;
var Promise = require("bluebird");
Promise.promisifyAll(require("mongodb"));

// TODO: move to better place
// make sure not-handled rejected Promises throw an error
process.on("unhandledRejection", function (error) {
    throw error;
});


// constants
const COURSES = 'courses';
const COURSES_TEMP = 'courses_temp';

// help function
// create a collection with unique index on gguid
var createCollection = function (db, name) {
    return db.createCollectionAsync(name).then(collection => {
        return collection.createIndexAsync('gguid', {unique: true}).then(() => {
            return collection;
        });
    });
};

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

        // create indexes etc.
        return this._init().then(() => {
            return this;
        });
    });
};

// create indexes and collections
Mongo.prototype._init = function () {
    log('INFO: initialize db');

    // create collections
    var promise1 = createCollection(this.db, COURSES).then(collection => {
        this.courses = collection;
    });
    var promise2 = createCollection(this.db, COURSES_TEMP).then(collection => {
        this.coursesTemp = collection;
    });

    // return when everything is ready
    return Promise.all([promise1, promise2]);
};

// drop db (for tests only)
Mongo.prototype._drop = function () {
    return this.db.dropDatabaseAsync().then(() => {
        log('WARNING: drop database!');
        return this._init();
    });
};

// drop temp_courses collection
Mongo.prototype.renameTempCourses = function () {
    return this.db.renameCollectionAsync(COURSES_TEMP, COURSES, {dropTarget: true}).then(() => {
        log('Rename ' + COURSES_TEMP + ' to ' + COURSES);
        return createCollection(this.db, COURSES_TEMP).then(collection => {
            this.coursesTemp = collection;
        });
    });
};

// insert a course (temp)
    Mongo.prototype.insertCourse = function (course) {
        log('Inserting course: ' + course.gguid);

    return this.coursesTemp.updateOne({gguid: course.gguid}, course, {upsert: true})
        .then(result => {
            if (result.upsertedCount == 1) {
                details('Insert course with id: ' + course.gguid);
            } else {
                details('Update course with id: ' + course.gguid);
            }
            return result;
        });
};

// get courses (not temp)
// TODO: add search object
Mongo.prototype.getCourses = function (param) {
    var parameters = param || {};
    var query =  {};
    var allowed = ['semester', 'field', 'id'];
    allowed.forEach(function(arg){
       if(typeof parameters[arg] !== 'undefined')
            query[arg] = parameters[arg];
    });
    return this.courses.find(query).project({_id: false}).toArrayAsync();
};

// export
exports.Mongo = Mongo;
exports.createClient = function (url) {
    var db = new Mongo(url);
    return db.connect();
};