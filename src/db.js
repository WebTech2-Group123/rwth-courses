'use strict';

const log = require('debug')('rwth-courses:db:info');
const error = require('debug')('rwth-courses:db:error');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

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
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    name_de: {
        type: String
    },
    description: {
        type: String
        //required: true
    },
    description_de: {
        type: String
    },
    semester: {
        type: String,
        required: true,
        index: true
    },
    ects: {
        type: Array,
        required: true
    },
    language: {
        type: Array,
        required: true
    },
    type: {
        type: Array,
        required: true
    },
    fields: {
        type: Array,
        required: true,
        index: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    events: {
        type: Array
    },
    units: {
        type: Array
    },
    contact: {
        type: Array
    }
});

// Cache Schema
const CacheSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    gguid: {
        type: String,
        required: true
    },
    response: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    inserted: {
        type: Date,
        default: Date.now
    }
}, {strict: false});

// TODO: make unique
CacheSchema.index({
    type: 1,
    gguid: 1
});

// project filter
const PROJECT_FILTER = {_id: false, __v: false};

// transform models in plain objects
function transform(arrayOfModels) {
    return arrayOfModels.map(model => {
        return model.toObject();
    });
}

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

    // Cache
    this.Cache = this.connection.model('Cache', CacheSchema);
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
        this.Cache
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
    return this.Courses.distinct('fields.field');
};

// get courses (not temp)
DB.prototype.getCourses = function (parameters) {
    return this.Courses.find(parameters).select(PROJECT_FILTER).exec().then(transform);
};

// returns the array of courses that match gguids included in parameter array
DB.prototype.getCoursesByIds = function (gguids) {
    return this.Courses.find({gguid: {$in: gguids}}).select(PROJECT_FILTER).exec().then(transform);
};

// insert course
DB.prototype.insertCourseInTemp = function (course, field) {

    // sanity check
    if (!field) {
        throw new Error('Please pass a field object to this method');
    }

    // try to insert -> if fails, update
    var toSave = this.CoursesTemp(course);
    toSave.fields = [field];

    return toSave.save()
        .then(() => {
            log('Insert course [' + course.gguid + '] ' + course.name);
            return true;
        })
        .catch(e => {

            // find and update (if exists)
            return this.CoursesTemp.findOneAndUpdate({gguid: course.gguid}, {$push: {fields: field}}).exec().then(doc => {

                // doc !== null -> document found and updated
                // doc === null -> document not found, need to insert it
                if (doc === null) {
                    error('Duplicate ID -> [' + course.gguid + '] ' + course.name + ' || ' + e);
                }

                log('Update course [' + course.gguid + '] ' + course.name);
                return false;
            });
        });
};

// test only: insert courses directly in courses table
DB.prototype._insertCourses = function (courses, fields) {
    if (!courses || !fields || courses.length !== fields.length) {
        throw new Error('Please pass a courses array and the corresponding fields array to this method');
    }
    var promises = courses.map((course, index)=> this.insertCourseInTemp(course, fields[index]));
    return Promise.all(promises).then(() => this.renameTempCourses());
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CACHE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getResponse(object) {
    return object && object.response;
}

DB.prototype.getCachedSemesters = function () {
    return this.Cache
        .findOne({type: 'semesters'})
        .exec()
        .then(getResponse);
};

DB.prototype.cacheSemesters = function (semestersResponse) {
    var toSave = this.Cache({
        type: 'semesters',
        gguid: 'no-gguid',
        response: semestersResponse
    });
    return toSave.save();
};

DB.prototype.getCachedFields = function (gguid) {
    return this.Cache
        .findOne({type: 'fields', gguid: gguid})
        .exec()
        .then(getResponse);
};

DB.prototype.cacheFields = function (gguid, fieldsResponse) {
    var toSave = this.Cache({
        type: 'fields',
        gguid: gguid,
        response: fieldsResponse
    });
    return toSave.save();
};

DB.prototype.getCachedSubFields = function (gguid) {
    return this.Cache
        .findOne({type: 'subfields', gguid: gguid})
        .exec()
        .then(getResponse);
};

DB.prototype.cacheSubFields = function (gguid, subFieldsResponse) {
    var toSave = this.Cache({
        type: 'subfields',
        gguid: gguid,
        response: subFieldsResponse
    });
    return toSave.save();
};

DB.prototype.getCachedCourses = function (gguid) {
    return this.Cache
        .findOne({type: 'courses', gguid: gguid})
        .exec()
        .then(getResponse);
};

DB.prototype.cacheCourses = function (gguid, coursesListResponse) {
    var toSave = this.Cache({
        type: 'courses',
        gguid: gguid,
        response: coursesListResponse
    });
    return toSave.save();
};

DB.prototype.getCachedCourseDetails = function (gguid) {
    return this.Cache
        .findOne({type: 'course-details', gguid: gguid})
        .exec()
        .then(getResponse);
};

DB.prototype.cacheCourseDetails = function (gguid, courseDetailsResponse) {
    var toSave = this.Cache({
        type: 'course-details',
        gguid: gguid,
        response: courseDetailsResponse
    });
    return toSave.save();
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