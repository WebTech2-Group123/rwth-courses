var assert = require('chai').assert;
var mongo = require('../src/mongo');

const COURSE_A = {
    general: {
        gguid: '0x0001',
        field: 'some value'
    }
};

const COURSE_B = {
    general: {
        gguid: '0x0002',
        field: 'some other value'
    }
};

describe('mongo.js', function () {

    // open connection to db & clean it
    beforeEach(function (done) {
        mongo.createClient().then(db => {

            // save db instanc
            this.db = db;

            // clear db
            db._drop().then(done);
        });
    });

    describe('.createClient', function () {
        it('should return a database client instance', function () {
            assert.instanceOf(this.db, mongo.Mongo);
        });
    });

    describe('.Mongo', function () {
        describe('#insertCourse', function () {
            it('should insert a course if not existing', function () {

            });
            it('should skip the course if already existing', function () {

            });
        });
    });

});