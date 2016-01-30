'use strict';

var log = require('debug')('db');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

// TODO: remove
mongoose.set('debug', true);

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


// TODO -> remove

//var db1 = new DB();
var db2 = new DB('mongodb://localhost/rwth');

//db1._drop();

var ids = [1, 2, 3, 4, 5, 6, 7, 8];
var pp = ids.map(id => new db2.CoursesTemp({gguid: id + '', size: id * id})).map(o => o.save());

Promise.all(pp).then(() => {
    log('insert all -> rename');
    db2.renameTempCourses()
        .then(() => log('rename'))
        .then(() => db2.close());
});

var c = new db2.SemestersCache({gguid: 'asad0', size: 234234});
c.save().then(aaa => log('saved'));

//setTimeout(() => db1.close(), 1000);