'use strict';

// get API URI from environment
const API_BASE = process.env.API_BASE;
const PROTOCOL = 'http://';

// this does the magic
const soap = require('soap');
const Promise = require('bluebird');

// log
const log = require('debug')('rwth-courses:campus');

// make promises crash if rejected
process.on('unhandledRejection', function (error) {
    throw error;
});

// APIs' endpoints
const WSDL_TERM = PROTOCOL + API_BASE + '/TermSrv.asmx?WSDL';
const WSDL_FIELD = PROTOCOL + API_BASE + '/FieldSrv.asmx?WSDL';
const WSDL_EVENT = PROTOCOL + API_BASE + '/EventSrv.asmx?WSDL';


// create the clients for CampusOffice APIs
function getClients() {

    // make 'soap' library Promise-friendly
    Promise.promisifyAll(soap);

    const termClient = soap.createClientAsync(WSDL_TERM, {
        endpoint: PROTOCOL + API_BASE + '/TermSrv.asmx'
    });

    const fieldClient = soap.createClientAsync(WSDL_FIELD, {
        endpoint: PROTOCOL + API_BASE + '/FieldSrv.asmx'
    });

    const eventClient = soap.createClientAsync(WSDL_EVENT, {
        endpoint: PROTOCOL + API_BASE + '/EventSrv.asmx'
    });

    // wait until all clients are created
    return Promise.all([termClient, fieldClient, eventClient])

        // promisify every single client
        .each(client =>Promise.promisifyAll(client));
}

// get list of semesters
function getSemestersList(termClient) {
    log('Getting semesters list');
    return termClient.GetAllAsync({});
}

// get the list of study fields by semester
function getStudyFieldsBySemster(termClient, semester) {
    log('Getting list of study fields for semester: ' + semester.name);
    return termClient.GetFieldsAsync({
        'sGuid': semester.gguid
    });
}

// get the list of subfields by field of study
function getSubFields(fieldClient, field) {
    log('Getting subfields for field: [' + field.gguid + '] ' + field.name);
    return fieldClient.GetLinkedAsync({
        'sGuid': field.gguid,
        'bTree': true,              // tree of subfields
        'bIncludeEvents': false     // courses without subfield will be catched later...
    });
}

// get the list of courses by subfield
function getCoursesBySubfiled(fieldClient, subfield) {
    log('Getting courses for subfield: [' + subfield.gguid + '] ' + subfield.name);
    return fieldClient.GetLinkedAsync({
        'sGuid': subfield.gguid,
        'bTree': false,             // we do not need the tree of subfields (handled before)
        'bIncludeEvents': true      // get courses
    });
}

// get the details of a course
function getCourseDetails(eventClient, course) {
    log('Getting course details for course: [' + course.gguid + '] ' + course.name);
    return eventClient.GetLinkedAsync({
        'sEvtSpec': course.gguid,
        'bIncludeFields': true,
        'bIncludeAdresses': true,
        'bIncludeAppointments': true,
        'bIncludeUnits': true
    });
}

// expose functions
exports.getClients = getClients;
exports.getSemestersList = getSemestersList;
exports.getStudyFieldsBySemster = getStudyFieldsBySemster;
exports.getSubFields = getSubFields;
exports.getCoursesBySubfiled = getCoursesBySubfiled;
exports.getCourseDetails = getCourseDetails;