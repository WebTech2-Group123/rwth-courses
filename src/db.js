'use strict';

var log = require('debug')('db');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

// TODO: remove
// mongoose.set('debug', true);

// make promises crash if rejected
process.on('unhandledRejection', function (error) {
    throw error;
});

// Collections Names
const COURSES = 'Courses';
const COURSES_TEMP = 'CoursesTemps';

// Courses Schema
const CoursesSchema = new mongoose.Schema({
    gguid: {
        type: String,
        required: true,
        index: true
    }
}, {strict: false});

// Cache Schema
const CacheSchema = new mongoose.Schema({
    gguid: {
        type: String,
        required: true,
        index: true
    }
}, {strict: false});

// project filter
const PROJECT_FILTER = {_id: false, __v: false};

// constructor
var DB = function (url) {

    // choose best db
    this.url = url || process.env.MONGO_URL || 'mongodb://localhost/rwth-courses';

    // connect to db
    this.connection = mongoose.createConnection(this.url);
    this.connection.on('open', () => {
        log('Connected to ' + this.url);
    });
    this.connection.on('close', () => {
        log('Disconnected to ' + this.url);
    });

    // register callback
    process.on('SIGINT', () => {
        this.connection.close();
    });

    // Courses
    this.Courses = this.connection.model(COURSES, CoursesSchema);
    this.CoursesTemp = this.connection.model(COURSES_TEMP, CoursesSchema);

    // Caches
    this.SemestersCache = this.connection.model('SemestersCache', CacheSchema);
    this.FieldsCache = this.connection.model('FieldsCache', CacheSchema);
    this.SubFieldsCache = this.connection.model('SubFieldsCache', CacheSchema);
    this.CoursesListCache = this.connection.model('CoursesListCache', CacheSchema);
    this.CoursesDetailsCache = this.connection.model('CoursesDetailsCache', CacheSchema);
};

// manually close the connection to the DB
DB.prototype.close = function () {
    return this.connection.close();
};

// drop db (for tests only)
DB.prototype._drop = function () {
    const collections = [
        this.Courses,
        this.CoursesTemp,
        this.SemestersCache,
        this.FieldsCache,
        this.SubFieldsCache,
        this.CoursesListCache,
        this.CoursesDetailsCache
    ];
    return Promise.all(collections.map(c => c.remove({}))).then(() => {
        log('Dropping ' + this.url);
    });
};

// drop courses collection and substitute it with temp_courses
DB.prototype.renameTempCourses = function () {

    // figure out correct names
    const temp = COURSES_TEMP.toLowerCase();
    const courses = COURSES.toLowerCase();

    // rename temp to courses
    return this.connection.db.renameCollection(temp, courses, {dropTarget: true}).then(() => {
        log('Rename ' + COURSES_TEMP + ' to ' + COURSES);

        // recreate index on temp
        return this.CoursesTemp.ensureIndexes().then(() => {
            log('Restored index on ' + COURSES_TEMP);
        });
    });
};

// get distinct semesters
DB.prototype.getSemesters = function () {
    return this.Courses.distinct('semester');
};

// get distinct study fields
DB.prototype.getStudyFields = function () {
    return this.Courses.distinct('field');
};

// get courses (not temp)
DB.prototype.getCourses = function (params) {
    var parameters = params || {};
    var query = {};

    // select only allowed parameters
    const allowed = ['semester', 'language', 'field', 'id'];
    allowed.forEach(function (arg) {
        if (typeof parameters[arg] !== 'undefined') {
            query[arg] = parameters[arg];
        }
    });

    // search courses
    return this.Courses.find(query).select(PROJECT_FILTER).exec().then(transform);
};

function transform(arrayOfModels) {
    return arrayOfModels.map(model => {
        return model.toObject();
    })
}

// returns the array of courses that match gguids included in parameter array
DB.prototype.getCoursesByIds = function (gguids) {
    return this.Courses.find({gguid: {$in: gguids}}).select(PROJECT_FILTER).exec().then(transform);
};

// insert a course (temp)
//Mongo.prototype.insertCourse = function (course) {
//    log('Inserting course: ' + course.gguid);
//
//    return this.coursesTemp.updateOne({gguid: course.gguid}, course, {upsert: true})
//        .then(result => {
//            if (result.upsertedCount == 1) {
//                details('Insert course with id: ' + course.gguid);
//            } else {
//                details('Update course with id: ' + course.gguid);
//            }
//            return result;
//        });
//};

// insert course -> TODO: find & update
DB.prototype.insertCourseInTemp = function (course) {
    var toSave = this.CoursesTemp(course);
    return toSave.save();
};

// test only: insert courses directly in courses table
DB.prototype._insertCourses = function (courses) {
    return this.Courses.create(courses);
};

// Singleton
var instance = null;
function getInstance() {
    if (instance === null) {
        instance = new DB();
    }
    return instance;
}

// exports
exports.DB = DB;
exports.getInstance = getInstance;
exports.COURSES = COURSES;
exports.COURSES_TEMP = COURSES_TEMP;