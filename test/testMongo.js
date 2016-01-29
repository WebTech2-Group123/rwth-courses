'use strict';

var assert = require('chai').assert;
var mongo = require('../src/mongo');

// make sure not-handled rejected Promises throw an error
var Promise = require("bluebird");
Promise.onPossiblyUnhandledRejection(error => {
    throw error;
});

const COURSE_A = {
    gguid: '0x0001',
    field: 'some value',
    semester: 'SS 2015'
};

const COURSE_B = {
    gguid: '0x0002',
    field: 'some other value',
    semester: 'WS 2015/2016'
};

const ids = ['0x0001', '0x0002'];

const filter = {
   field : 'some value'
};

describe('mongo.js', function () {

    // open connection to db & clean it
    beforeEach(function (done) {
        mongo.createClient('mongodb://localhost:27017/rwth-courses-test').then(db => {

            // save db instanc
            this.db = db;

            // clear db
            db._drop().then(() => done());
        });
    });

    describe('.createClient()', function () {
        it('should return a database client instance', function () {
            assert.instanceOf(this.db, mongo.Mongo);
        });
    });

    describe('.Mongo', function () {

        describe('#insertCourse()', function () {
            it('should insert a course if not existing', function (done) {
                this.db.insertCourse(COURSE_A).then(result => {
                    assert.equal(result.upsertedCount, 1);
                    assert.equal(result.modifiedCount, 0);
                    return this.db.insertCourse(COURSE_B);
                }).then(result => {
                    assert.equal(result.upsertedCount, 1);
                    assert.equal(result.modifiedCount, 0);
                    done();
                });
            });
            it('should skip the course if already existing', function (done) {
                this.db.insertCourse(COURSE_A).then(result => {
                    assert.equal(result.upsertedCount, 1);
                    assert.equal(result.modifiedCount, 0);
                    return this.db.insertCourse(COURSE_A);
                }).then(result => {
                    assert.equal(result.upsertedCount, 0);
                    assert.equal(result.modifiedCount, 1);
                    done();
                });
            });
        });

        describe('#getCourses()', function () {
            it('should return an empty array if no course in present', function (done) {
                this.db.getCourses().then(courses => {
                    assert.equal(courses.length, 0);
                    done();
                });
            });
            it('should get all the courses if any present', function (done) {
                this.db.insertCourse(COURSE_A).then(() => {
                    return this.db.insertCourse(COURSE_B);
                }).then(() => {
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getCourses();
                }).then(courses => {
                    assert.equal(courses.length, 2);
                    done();
                });
            });

            it('should get course A', function (done) {
                this.db.insertCourse(COURSE_A).then(() => {
                    return this.db.insertCourse(COURSE_B);
                }).then(() => {
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getCourses(filter);
                }).then(courses => {
                    assert.equal(courses.length, 1);
                    assert.deepEqual(courses[0], COURSE_A);
                    done();
                });
            });
        });

        describe('#getSemesters()', function(){
            it('should return list of distinct semesters (in this case [WS 2015/2016, SS 2015])', function(done){
                this.db.insertCourse(COURSE_A).then(() => {
                    return this.db.insertCourse(COURSE_B);
                }).then(() => {
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getSemesters();
                }).then(semesters => {
                    assert.equal(semesters.length, 2);
                    done();
                });
            });
        });

        describe('#getStudyFields()', function(){
            it('should return list of distinct fields', function(done){
                this.db.insertCourse(COURSE_A).then(() => {
                    return this.db.insertCourse(COURSE_B);
                }).then(() => {
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getStudyFields();
                }).then(fields => {
                    assert.equal(fields.length, 2);
                    done();
                });
            });
        });

        describe('#getCoursesByIds()', function(){
            it('should return list of courses by the array of ids', function(done){
                this.db.insertCourse(COURSE_A).then(() => {
                    return this.db.insertCourse(COURSE_B);
                }).then(() => {
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getCoursesByIds(ids);
                }).then(courses => {
                    assert.equal(courses.length, 2);
                    done();
                });
            });
        });

        describe('#renameTempCourses()', function () {
            it('should remove courses, rename temp to courses and create courses again', function (done) {
                this.db.renameTempCourses().then(() => {
                    return this.db.courses.indexesAsync();
                }).then(indexes => {
                    var gguidIndex = indexes.reduce((acc, el) => {
                        return acc || el.key.gguid == 1;
                    }, false);
                    assert.isTrue(gguidIndex);
                    done();
                });
            });
        });
    });

});