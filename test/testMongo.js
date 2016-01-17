var assert = require('chai').assert;
var mongo = require('../src/mongo');

describe('mongo.js', function () {

    describe('.createClient', function () {
        it('should return a database client instance', function () {
            var db = mongo.createClient();
            assert.instanceOf(db, mongo.Mongo);
        });
    });

    describe('.Mongo', function () {
    });

});