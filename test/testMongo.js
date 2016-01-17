var assert = require('chai').assert;
var mongo = require('../src/mongo');

const COURSE_A = {
    gguid: '0x0001',
    field: 'some value'
};

const COURSE_B = {
    gguid: '0x0002',
    field: 'some other value'
};

describe('mongo.js', function () {

    // open connection to db & clean it
    beforeEach(function (done) {
        mongo.createClient().then(db => {

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
                }).catch(err => done(err));
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
                }).catch(err => done(err));
            });
        });

        describe('#getCourses()', function () {
            it('should return an empty array if no course in present', function (done) {
                this.db.getCourses().then(courses => {
                    assert.equal(courses.length, 0);
                    done();
                }).catch(err => done(err));
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
                }).catch(err => done(err));
            });
        });

        describe('#renameTempCourses()', function () {
            it('should remove courses, rename temp to courses and create courses again', function (done) {
                this.db.renameTempCourses().then(() => {
                    return this.db.courses.indexesAsync();
                }).then(indexes => {
                    var a = 1;
                    done();
                }).catch(err => done(err));
            });
        });
    });

});