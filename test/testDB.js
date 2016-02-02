'use strict';

var assert = require('chai').assert;
var db = require('../src/db');

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
    field: 'some value'
};

describe('db.js', function () {

    beforeEach('open connection to db & clean it', function (done) {
        this.db = new db.DB('mongodb://localhost:27017/rwth-courses-test');
        this.db._drop().then(() => {
            done();
        });
    });

    afterEach('close the connection to the db', function () {
        this.db.close();
    });

    describe('.getInstance()', function () {
        it('should return a database client instance', function () {
            assert.instanceOf(db.getInstance(), db.DB);
        });
    });

    describe('.Mongo', function () {

        describe('#insertCourse()', function () {
            //it('should insert a course', function (done) {
            //    this.db.insertCourse(COURSE_A).then(result => {
            //        assert.equal(result.upsertedCount, 1);
            //        assert.equal(result.modifiedCount, 0);
            //        return this.db.insertCourse(COURSE_B);
            //    }).then(result => {
            //        assert.equal(result.upsertedCount, 1);
            //        assert.equal(result.modifiedCount, 0);
            //        done();
            //    });
            //});
            //it('should skip the course if already existing', function (done) {
            //    this.db.insertCourse(COURSE_A).then(result => {
            //        assert.equal(result.upsertedCount, 1);
            //        assert.equal(result.modifiedCount, 0);
            //        return this.db.insertCourse(COURSE_A);
            //    }).then(result => {
            //        assert.equal(result.upsertedCount, 0);
            //        assert.equal(result.modifiedCount, 1);
            //        done();
            //    });
            //});
        });

        describe('#getCourses()', function () {
            it('should return an empty array if no course in present', function (done) {
                this.db.getCourses().then(courses => {
                    assert.equal(courses.length, 0);
                    done();
                });
            });
            it('should get all the courses if any present', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B]).then(() => {
                    return this.db.getCourses({});
                }).then(courses => {
                    assert.equal(courses.length, 2);
                    assert.deepEqual(courses[0], COURSE_A);
                    assert.deepEqual(courses[1], COURSE_B);
                    done();
                });
            });
            it('should get only the courses which match the query object', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B]).then(() => {
                    return this.db.getCourses(filter);
                }).then(courses => {
                    assert.equal(courses.length, 1);
                    assert.deepEqual(courses[0], COURSE_A);
                    done();
                });
            });
        });

        describe('#getSemesters()', function () {
            it('should return list of distinct semesters (in this case [WS 2015/2016, SS 2015])', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B]).then(() => {
                    return this.db.getCourses(filter);
                }).then(() => {
                    return this.db.getSemesters();
                }).then(semesters => {
                    assert.equal(semesters.length, 2);
                    done();
                });
            });
        });

        describe('#getStudyFields()', function () {
            it('should return list of distinct fields', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B]).then(() => {
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
            it('should return list of courses by the array of ids', function (done) {
                this.db._insertCourses([COURSE_A, COURSE_B]).then(() => {
                    return this.db.getCourses(filter);
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