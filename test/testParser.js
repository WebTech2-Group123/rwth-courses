'use strict';

var assert = require('assert');
var parser = require('../src/parser');

// semesters
const SEMESTERS_RESPONSE = require('./json/responses/semesters');
const SEMESTERS = require('./json/parsed/semesters');

// fields
const FIELDS_RESPONSE = require('./json/responses/fields');
const FIELDS = require('./json/parsed/fields');

// subfields
const SUB_FIELDS_RESPONSE = require('./json/responses/subfields');
const SUB_FIELDS_PARSED = require('./json/parsed/subfields');

// courses list
const COURSES_LIST_RESPONSE = require('./json/responses/courses');
const COURSES_LIST = require('./json/parsed/courses');

// course details
const COURSE_DETAILS_RESPONSE = require('./json/responses/course_details');
const COURSE_DETAILS = require('./json/parsed/course_details');

// test
describe('parser.js', function () {

        describe('#parseSemesters()', function () {
            it('should return the last 2 semsters (current and last one)', function () {
                const semesters = parser.parseSemesters(SEMESTERS_RESPONSE);
                const expected = SEMESTERS.map(semester => {
                    semester.start = new Date(semester.start);
                    return semester;
                });
                assert.deepEqual(semesters, expected);
            });
        });

        describe('#parseFieldOfStudies()', function () {
            it('should return all field of studies of a specific semester', function () {
                const fields = parser.parseFieldOfStudies(FIELDS_RESPONSE);
                assert.deepEqual(fields, FIELDS);
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