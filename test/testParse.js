var assert = require('assert');
var parser = require('../src/parser');

// semesters
const SEMESTERS_RESPONSE = require('./json/responses/semesters');
const SEMESTER_1 = {
    gguid: '0x0B473CF286B45B4984CD02565C07D6F8',
    name: 'WS 2015/2016',
    start: new Date('2015-10-01T00:00:00')
};
const SEMESTER_2 = {
    gguid: '0xBA76F399D1893541BFCF7CBC6BAFE455',
    name: 'SS 2015',
    start: new Date('2015-04-01T00:00:00')
};

// fields
const FIELDS_RESPONSE = require('./json/responses/fields');
const FIELD = {
    gguid: '0x5A266C5046CF0E46AFFEBA62F34B5F85',
    name: 'Architektur (D)',
    semester: 'WS 2015/2016',
    group: "Diplomstudiengänge (D)"
};

// subfields
const SUB_FIELDS_RESPONSE = require('./json/responses/subfields');
const SUB_FIELDS_PARSED = require('./json/parsed/subfields');

// courses list
const COURSES_LIST_RESPONSE = require('./json/responses/courses');
const COURSES_LIST = require('./json/parsed/courses');

// course details
const COURSE_DETAILS_RESPONSE = require('./json/responses/course');
const COURSE_DETAILS = require('./json/parsed/course');

// test
describe('parser.js', function () {

        describe('#parseSemesters()', function () {
            it('should return the last 2 semsters (current and last one)', function () {
                const semesters = parser.parseSemesters(SEMESTERS_RESPONSE);
                assert.deepEqual(semesters[0], SEMESTER_1);
                assert.deepEqual(semesters[1], SEMESTER_2);
            });
        });

        describe('#parseFieldOfStudies()', function () {
            it('should return all field of studies of a specific semester', function () {
                const fields = parser.parseFieldOfStudies(FIELDS_RESPONSE);
                assert.deepEqual(fields[0], FIELD);
                assert.equal(fields.length, 2);
            });
        });

        describe('#parseSubFields()', function () {
            it('should return an array of subfields of specific field of study', function () {
                const subfields = parser.parseSubFields(SUB_FIELDS_RESPONSE);
                assert.deepEqual(subfields, SUB_FIELDS_PARSED);
            })
        });

        describe('#parseCoursesList()', function () {
            it('should return an array of GGUIDs of courses for a specific subfield of study', function () {
                const courses = parser.parseCoursesList(COURSES_LIST_RESPONSE);
                assert.deepEqual(courses, COURSES_LIST);
            })
        });

        describe('#parseCourseDetails()', function () {
            it('should return all the details for a specific course', function () {
                const details = parser.parseCourseDetails(COURSE_DETAILS_RESPONSE);
                assert.deepEqual(details, COURSE_DETAILS);
            })
        })
    }
);