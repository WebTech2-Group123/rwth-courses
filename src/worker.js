'use strict';

const Rx = require('rx');
const Campus = require('./campus');
const Parser = require('./parser');
const db = require('./db').getInstance();

// log
const info = require('debug')('rwth-courses:worker:info');
const error = require('debug')('rwth-courses:worker:error');

// make promises crash if rejected
process.on('unhandledRejection', function (error) {
    throw error;
});

// utils
function delayBy(time) {
    return function (value, index) {
        return Rx.Observable.return(value).delay(index === 0 ? 0 : time);
    };
}

// time constants
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

// download courses list
function doJob(o) {

    // parse options to slow down the worker
    var options = o || {};
    var delaySemesters = options.delaySemesters || 10 * MINUTES;
    var delayFields = options.delayFields || 60 * SECONDS;
    var delaySubfields = options.delaySubfields || 2 * SECONDS;
    var delayCoursesList = options.delayCoursesList || 100;

    // TODO -> remove
    // var n = options.n || 300;

    // create campus client
    const client = new Campus({cache: true, db: db});

    // log
    info('Starting getting data from CampusOffice');
    const startTime = +Date.now();

    // initialize the Campus client
    const s = Rx.Observable.fromPromise(client.init())

        // get semesters list
        .flatMap(() => {
            return client.getSemestersList();
        })

        // select the first two semesters
        .flatMap(semestersResponse => {
            return Parser.parseSemesters(semestersResponse);
        })

        // here -> stream of semesters
        // postpone semesters execution by "delaySemesters" time
        .map(delayBy(delaySemesters))
        .concatAll()

        // for each semester -> get all fields
        .flatMap(semester => {
            return client.getStudyFieldsBySemester(semester);
        })

        // parse raw response with list of fields
        .flatMap(fieldsListResponse => {
            return Parser.parseFieldOfStudies(fieldsListResponse);
        })

        // TODO: remove
        .filter(field => field.name.indexOf('Informatik') == 0)

        // here -> stream of fields
        // postpone execution by "delayFields" time
        .map(delayBy(delayFields))
        .concatAll()

        // for each field -> request the subfields
        // NB: pass also the field (contains info about B.Sc. vs M.Sc. etc.)
        .flatMap(field => {
            return client.getSubFields(field).then(subfieldsResponse => {
                return {
                    field: field,
                    subfieldsResponse: subfieldsResponse
                };
            });
        })

        // parse subfields
        .flatMap(object => {
            let field = object.field;
            let subfieldsResponse = object.subfieldsResponse;

            return Parser.parseSubFields(subfieldsResponse).map(subfield => {
                return {
                    field: field,
                    subfield: subfield
                };
            });
        })

        // here -> stream of subfields
        // postpone execution by "delaySubfields" time
        .map(delayBy(delaySubfields))
        .concatAll()

        // request courses for each subfield
        .flatMap(object => {
            let field = object.field;
            let subfield = object.subfield;

            return client.getCoursesBySubfiled(subfield).then(coursesListResponse => {
                return {
                    field: field,
                    subfield: subfield,
                    coursesListResponse: coursesListResponse
                };
            });
        })

        // parse courses
        .flatMap(object => {
            let field = object.field;
            let subfield = object.subfield;
            let coursesListResponse = object.coursesListResponse;

            return Parser.parseCoursesList(coursesListResponse).map(course => {
                return {
                    field: field,
                    subfield: subfield,
                    course: course
                };
            });
        })

        // TODO: remove
        //.take(n)

        // here -> stream of courses
        // postpone execution by "delayCoursesList" time
        .map(delayBy(delayCoursesList))
        .concatAll()

        // request details for this course
        // and parse the result
        .flatMap(object => {
            let field = object.field;
            let subfield = object.subfield;
            let course = object.course;

            return client.getCourseDetails(course).then(courseDetailsResponse => {
                return {
                    field: field,
                    subfield: subfield,
                    course: Parser.parseCourseDetails(courseDetailsResponse)
                };
            });
        })

        // store course in the DB
        .flatMap(object => {

            // extract course
            let course = object.course;

            // create field object
            let field = {
                group: object.field.group,
                field: object.field.name,
                subfield: object.subfield.name,
                path: object.subfield.path
            };

            // store in mongo
            return db.insertCourseInTemp(course, field).catch(e => {
                error('Duplicate course with ID: ' + course.gguid + ' --> ' + e);
                throw e;
            });
        })

        // make sure to use hot observables
        // NB: do not remove this
        .publish().refCount();


    // subscribe to know the end of the process
    s.subscribe(function (x) {
        // do nothing here
    }, function (e) {
        error(e);
        throw e;
    }, function () {

        // we are done
        const endTime = +Date.now();
        info('Finish getting data from CampusOffice. Total time: ' + (endTime - startTime) + ' ms');

        // switch collections
        db.renameTempCourses().then(function () {

            // close connection to DB
            db.close();
        });
    });
}

exports.doJob = doJob;

doJob();
