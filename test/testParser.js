'use strict';

var assert = require('assert');
var parser = require('../src/parser');

// semesters
const SEMESTERS_RESPONSE = require('./json/raw/semesters');
const SEMESTERS = require('./json/parsed/semesters');

// fields
const FIELDS_RESPONSE = require('./json/raw/fields');
const FIELDS = require('./json/parsed/fields');

// subfields
const SUB_FIELDS_RESPONSE = require('./json/raw/subfields');
const SUB_FIELDS_PARSED = require('./json/parsed/subfields');

// courses list
const COURSES_LIST_RESPONSE = require('./json/raw/courses');
const COURSES_LIST = require('./json/parsed/courses');

// course details
const COURSE_DETAILS_RESPONSE_1 = require('./json/raw/course_details_1');
const COURSE_DETAILS_1 = require('./json/parsed/course_details_1');
const COURSE_DETAILS_RESPONSE_2 = require('./json/raw/course_details_2');
const COURSE_DETAILS_2 = require('./json/parsed/course_details_2');

// languages
const LANGUAGES_RAW = require('./json/raw/languages');
const LANGUAGES = require('./json/parsed/languages');

// ects
const ECTS_RAW = require('./json/raw/ects');
const ECTS = require('./json/parsed/ects');

// types
const TYPES_RAW = require('./json/raw/types');
const TYPES = require('./json/parsed/types');

// info
const INFO_1_RAW = require('./json/raw/info_1');
const INFO_1 = require('./json/parsed/info_1');
const INFO_2_RAW = require('./json/raw/info_2');
const INFO_2 = require('./json/parsed/info_2');

// institutes
const INSTITUTES_RAW = require('./json/raw/institutes');
const INSTITUTES = require('./json/parsed/institutes');

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
        });
    });

    describe('#parseCoursesList()', function () {
        it('should return an array of GGUIDs of courses for a specific subfield of study', function () {
            const courses = parser.parseCoursesList(COURSES_LIST_RESPONSE);
            assert.deepEqual(courses, COURSES_LIST);
        });
    });

    describe('#parseCourseDetails()', function () {
        it('should return all the details for a specific course (1)', function () {
            const details = parser.parseCourseDetails(COURSE_DETAILS_RESPONSE_1);
            assert.deepEqual(details, COURSE_DETAILS_1);
        });
        it('should return all the details for a specific course (2)', function () {
            const details = parser.parseCourseDetails(COURSE_DETAILS_RESPONSE_2);
            assert.deepEqual(details, COURSE_DETAILS_2);
        });
    });

    describe('#parseLanguage()', function () {
        it('should return UNKNOWN if language not known', function () {
            const parsed = parser.parseLanguage();
            assert.deepEqual(parsed, ['UNKNOWN']);
        });
        it('should correctly parse German and English', function () {
            LANGUAGES_RAW.forEach(function (language, index) {
                const parsed = parser.parseLanguage(language);
                assert.deepEqual(parsed, LANGUAGES[index]);
            });
        });
        it('should return OTHER if language neither German nor English', function () {
            const parsed = parser.parseLanguage('Chinese');
            assert.deepEqual(parsed, ['OTHER']);
        });
    });

    describe('#parseECTS()', function () {
        it('should return [0] if no ects field is available', function () {
            const parsed = parser.parseECTS();
            assert.deepEqual(parsed, [0]);
        });
        it('should correctly parse the crazy ECTS in Campus', function () {
            ECTS_RAW.forEach(function (ects, index) {
                const parsed = parser.parseECTS(ects);
                assert.deepEqual(parsed, ECTS[index]);
            });
        });
    });

    describe('#parseType()', function () {
        it('should correctly parse the types string', function () {
            TYPES_RAW.forEach(function (type, index) {
                const parsed = parser.parseType(type);
                assert.deepEqual(parsed, TYPES[index]);
            });
        });
    });

    describe('#parseInfo()', function () {
        it('should correctly parse the info section (1)', function () {
            const parsed = parser.parseInfo(INFO_1_RAW);
            assert.deepEqual(parsed, INFO_1);
        });
        it('should correctly parse the info section (2)', function () {
            const parsed = parser.parseInfo(INFO_2_RAW);
            assert.deepEqual(parsed, INFO_2);
        });
    });

    describe('#parseInstitute()', function () {
        it('should correctly parse the types string', function () {
            INSTITUTES_RAW.forEach(function (institutes, index) {
                const parsed = parser.parseInstitute(institutes);
                assert.deepEqual(parsed, INSTITUTES[index]);
            });
        });
    });

});