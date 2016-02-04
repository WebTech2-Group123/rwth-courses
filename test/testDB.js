'use strict';

const extend = require('util')._extend;
const assert = require('chai').assert;
const db = require('../src/db');

// load test data
const COURSE_A = require('./json/parsed/course_details_1.json');
const COURSE_B = require('./json/parsed/course_details_2.json');

const FIELD_A = {
    field: 'some value'
};

const FIELD_B = {
    field: 'bbb'
};

const filter = {
    'fields.field': 'some value'
};

describe('db.js', function () {

    before('create the db instance', function (done) {
        this.db = new db.DB('mongodb://localhost:27017/rwth-courses-test');
        this.db.connection.on('open', done);
    });

    beforeEach('open connection to db & clean it', function (done) {
        this.db._drop().then(() => {
            done();
        });
    });

    after('close the connection to the db', function (done) {
        this.db.close().then(() => done());
    });

    describe('.getInstance()', function () {
        it('should return a database client instance', function () {
            assert.instanceOf(db.getInstance(), db.DB);
        });
    });

    describe('.Mongo', function () {

        describe('#insertCourseInTemp()', function () {
            it('should insert a course and update an existing one', function (done) {
                this.db.insertCourseInTemp(COURSE_A, FIELD_A).then(result => {
                    assert.isTrue(result);
                    return this.db.insertCourseInTemp(COURSE_A, FIELD_B);
                }).then(result => {
                    assert.isFalse(result);
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getCourses();
                }).then(courses => {
                    assert.equal(courses.length, 1);
                    assert.deepEqual(courses[0].fields, [FIELD_A, FIELD_B]);

                    let expected = extend({}, COURSE_A);
                    expected.fields = [FIELD_A, FIELD_B];
                    assert.deepEqual(expected, courses[0]);

                    done();
                });
            });
            it('should insert 2 different courses', function (done) {
                this.db.insertCourseInTemp(COURSE_A, FIELD_A).then(result => {
                    assert.isTrue(result);
                    return this.db.insertCourseInTemp(COURSE_B, FIELD_B);
                }).then(result => {
                    assert.isTrue(result);
                    return this.db.renameTempCourses();
                }).then(() => {
                    return this.db.getCourses();
                }).then(courses => {
                    assert.equal(courses.length, 2);
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
                this.db._insertCourses([COURSE_A, COURSE_B], [FIELD_A, FIELD_B]).then(() => {
                    return this.db.getCourses({});
                }).then(courses => {
                    assert.equal(courses.length, 2);
                    assert.deepEqual(courses[0], extend({fields: [FIELD_A]}, COURSE_A));
                    assert.deepEqual(courses[1], extend({fields: [FIELD_B]}, COURSE_B));
                    done();
                });
            });
            it('should get only the courses which match the query object', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B], [FIELD_A, FIELD_B]).then(() => {
                    return this.db.getCourses(filter);
                }).then(courses => {
                    assert.equal(courses.length, 1);
                    assert.deepEqual(courses[0], extend({fields: [FIELD_A]}, COURSE_A));
                    done();
                });
            });
        });

        describe('#getSemesters()', function () {
            it('should return list of distinct semesters (in this case [WS 2015/2016, SS 2015])', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B], [FIELD_A, FIELD_B]).then(() => {
                    return this.db.getCourses(filter);
                }).then(() => {
                    return this.db.getSemesters();
                }).then(semesters => {
                    assert.equal(semesters.length, 1);
                    done();
                });
            });
        });

        describe('#getStudyFields()', function () {
            it('should return list of distinct fields', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B], [FIELD_A, FIELD_B]).then(() => {
                    return this.db.getCourses(filter);
                }).then(() => {
                    return this.db.getStudyFields();
                }).then(fields => {
                    assert.equal(fields.length, 2);
                    done();
                });
            });
        });

        describe('#getCoursesByIds()', function () {
            it('should return list of courses by the array of ids (1)', function (done) {
                this.db._insertCourses([COURSE_A], [FIELD_A]).then(() => {
                    return this.db.getCourses(filter);
                }).then(() => {
                    return this.db.getCoursesByIds([COURSE_A.gguid, COURSE_B.gguid]);
                }).then(courses => {
                    assert.equal(courses.length, 1);
                    done();
                });
            });
            it('should return list of courses by the array of ids (2)', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B], [FIELD_A, FIELD_B]).then(() => {
                    return this.db.getCourses(filter);
                }).then(() => {
                    return this.db.getCoursesByIds([COURSE_A.gguid, COURSE_B.gguid]);
                }).then(courses => {
                    assert.equal(courses.length, 2);
                    done();
                });
            });
        });

        describe('#renameTempCourses()', function () {
            it('should remove courses, rename temp to courses and create courses again', function (done) {
                this.db.renameTempCourses().then(() => {
                    return this.db.connection.collection(db.COURSES_TEMP.toLocaleLowerCase()).indexes();
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