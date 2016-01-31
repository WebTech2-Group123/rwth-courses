'use strict';

// this does the magic
const soap = require('soap');
const Promise = require('bluebird');
const log = require('debug')('rwth-courses:campus');
const details = require('debug')('rwth-courses:campus:details');

// make promises crash if rejected
process.on('unhandledRejection', function (error) {
    throw error;
});

// make 'soap' library Promise-friendly
Promise.promisifyAll(soap);

// constructor
var Campus = function (o) {
    var options = o || {};

    // get API URI from environment if not specified
    this.url = options.url || process.env.API_BASE;

    // check that link is given
    if (typeof this.url === 'undefined') {
        throw new Error('Campus API base URI not specified! Try to set the env variable API_BASE');
    }

    // APIs' endpoints
    this.WSDL_TERM = this.url + '/TermSrv.asmx?WSDL';
    this.WSDL_FIELD = this.url + '/FieldSrv.asmx?WSDL';
    this.WSDL_EVENT = this.url + '/EventSrv.asmx?WSDL';

    // cache enabled?
    this.cache = options.cache;

    // passed a db
    if (this.cache) {
        this.db = options.db;

        // check that a db was passed here
        if (typeof this.db === 'undefined') {
            throw new Error('Please pass a db instance to use if you want to use the cache system');
        }
    }
};

// get Term client
Campus.prototype.getTermClient = function () {
    log('Creating Term client');

    // create client
    const termClient = soap.createClientAsync(this.WSDL_TERM, {
        endpoint: this.url + '/TermSrv.asmx'
    });

    // promisify the client
    return termClient.then(client => Promise.promisifyAll(client));
};

// get Field client
Campus.prototype.getFieldClient = function () {
    log('Creating Field client');

    // create client
    const termClient = soap.createClientAsync(this.WSDL_FIELD, {
        endpoint: this.url + '/FieldSrv.asmx'
    });

    // promisify the client
    return termClient.then(client => Promise.promisifyAll(client));
};

// get Event client
Campus.prototype.getEventClient = function () {
    log('Creating Event client');

    // create client
    const termClient = soap.createClientAsync(this.WSDL_EVENT, {
        endpoint: this.url + '/EventSrv.asmx'
    });

    // promisify the client
    return termClient.then(client => Promise.promisifyAll(client));
};

// get list of semesters
Campus.prototype.getSemestersList = function () {
    log('Getting semesters list');

    // function to get the semesters list from the Campus APIs
    var getSemstersListFromCampus = () => {

        // create client if not present
        if (typeof this.termClient === 'undefined') {
            details('Get semesters list from Campus');

            return this.getTermClient().then(client => {

                // cache the client
                this.termClient = client;

                // api call
                return this.termClient.GetAllAsync({});
            });
        }

        // api call
        else {
            return this.termClient.GetAllAsync({});
        }
    };

    // check cache!
    if (this.cache) {

        // check in database
        return this.db.getCachedSemesters().then(semestersResponse => {

            // if cached -> return it
            if (semestersResponse !== null) {
                details('Get semesters list from Cache');

                return semestersResponse;
            }

            // cache miss -> request from Campus
            else {
                return getSemstersListFromCampus().then(semestersResponse => {
                    return this.db.cacheSemesters(semestersResponse).then(_ => semestersResponse);
                });
            }
        });
    }

    // no cache -> request from Campus
    else {
        return getSemstersListFromCampus();
    }
};

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
module.exports = Campus;