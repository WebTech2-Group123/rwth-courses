'use strict';

var log = require('debug')('db');
var mongoose = require('mongoose');

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

    // Cache Schema
    var CacheSchema = new mongoose.Schema({
        gguid: {
            type: String,
            required: true,
            index: true
        }
    }, {strict: false});

    // Caches
    this.SemestersCache = this.connection.model('SemestersCache', CacheSchema);
    this.FieldsCache = this.connection.model('FieldsCache', CacheSchema);
    this.SubFieldsCache = this.connection.model('SubFieldsCache', CacheSchema);
    this.CoursesListCache = this.connection.model('CoursesListCache', CacheSchema);
    this.CoursesDetailsCache = this.connection.model('CoursesDetailsCache', CacheSchema);

    // Courses Schema
    var CoursesSchema = new mongoose.Schema({
        gguid: {
            type: String,
            required: true,
            index: true
        }
    }, {strict: false});

    // Courses
    this.Courses = this.connection.model('Courses', CoursesSchema);
    this.CoursesTemp = this.connection.model('CoursesTemp', CoursesSchema);
};

// manually close the connection to the DB
DB.prototype.close = function () {
    this.connection.close();
};

// drop db (for tests only)
DB.prototype._drop = function () {
    log('WARN: Dropping ' + this.url);
    this.connection.db.dropDatabase();
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

var db1 = new DB();
var db2 = new DB('mongodb://localhost/rwth');

db1._drop();

db1.close();

setTimeout(() => db2.close(), 2000);
