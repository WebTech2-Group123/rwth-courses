'use strict';

const Rx = require('rx');
const Campus = require('./campus');
const Parser = require('./parser');
const db = require('./db').getInstance();

// log
const info = require('debug')('worker:info');
const error = require('debug')('worker:error');

// make promises crash if rejected
process.on('unhandledRejection', function (error) {
    throw error;
});

// TODO: remove
const N = 5;

// unwrap clients
Campus.getClients().then(clients => {

    // clients for the 3 SOAP endpoints
    const termClient = clients[0];
    const fieldClient = clients[1];
    const eventClient = clients[2];

    // log
    info('Starting getting data from CampusOffice');
    const startTime = +Date.now();

    // API-call to CampusOffice for all Semesters
    const s = Rx.Observable.fromPromise(Campus.getSemestersList(termClient))

        // select the first two semesters
        .flatMap(semestersResponse => {
            return Parser.parseSemesters(semestersResponse);
        })

        // for each semester -> get all fields
        .flatMap(semester => {
            return Campus.getStudyFieldsBySemster(termClient, semester);
        })

        // parse raw response with list of fields
        .flatMap(fieldsListResponse => {
            return Parser.parseFieldOfStudies(fieldsListResponse)
        })

        // TODO: remove
        .filter(field => field.name.indexOf('Informatik') == 0)

        // for each field -> request the subfields
        // NB: pass also the field (contains info about B.Sc. vs M.Sc. etc.)
        .flatMap(field => {
            return Campus.getSubFields(fieldClient, field).then(subfieldsResponse => {
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

        // TODO: remove
        .take(N)

        // request courses for each subfield
        .flatMap(object => {
            let field = object.field;
            let subfield = object.subfield;

            return Campus.getCoursesBySubfiled(fieldClient, subfield).then(coursesListResponse => {
                return {
                    field: field,
                    subfield: subfield,
                    coursesListResponse: coursesListResponse
                };
            });
        })

        // TODO: remove
        .take(N)

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

        // TODO: filter types of courses
        .filter(course => true)

        // request details for this course
        // and parse the result
        .flatMap(object => {
            let field = object.field;
            let subfield = object.subfield;
            let course = object.course;

            // TODO: check if course was already in the database before doing this

            return Campus.getCourseDetails(eventClient, course).then(courseDetailsResponse => {
                return {
                    field: field,
                    subfield: subfield,
                    course: Parser.parseCourseDetails(courseDetailsResponse)
                };
            });
        })

        // store course in the DB
        .flatMap(object => {
            let field = object.field;
            let subfield = object.subfield;
            let course = object.course;

            // combine useful info
            course.group = field.group;
            course.field = field.name;
            course.subfield = subfield.name;
            course.path = subfield.aath;

            // store in mongo
            return db.insertCourseInTemp(course);
        })

        // make sure to use hot observables
        // NB: do not remove this
        .publish().refCount();


    // subscribe to know the end of the process
    s.subscribe(function (x) {
        // do nothing here
    }, function (e) {
        error(e);
    }, function () {

        // we are done
        const endTime = +Date.now();
        info('Finish getting data from CampusOffice. Total time: ' + (startTime - endTime));

        // switch collections
        db.renameTempCourses().then(function () {

            // close connection to DB
            db.close();
        });
    });

});