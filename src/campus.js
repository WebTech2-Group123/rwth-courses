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

    // remember if clients ready
    this.ready = false;
};

// create clients
Campus.prototype.init = function () {
    log('Init: create all clients');

    // parallel create clients
    return Promise.all([this._getTermClient(), this._getFieldClient(), this._getEventClient()]).then(clients => {
        this.ready = true;

        // save clients
        this._termClient = clients[0];
        this._fieldClient = clients[1];
        this._eventClient = clients[2];
    });
};

// get Term client
Campus.prototype._getTermClient = function () {
    log('Creating Term client');

    // create client
    const termClient = soap.createClientAsync(this.WSDL_TERM, {
        endpoint: this.url + '/TermSrv.asmx'
    });

    // promisify the client
    return termClient.then(client => Promise.promisifyAll(client));
};

// get Field client
Campus.prototype._getFieldClient = function () {
    log('Creating Field client');

    // create client
    const termClient = soap.createClientAsync(this.WSDL_FIELD, {
        endpoint: this.url + '/FieldSrv.asmx'
    });

    // promisify the client
    return termClient.then(client => Promise.promisifyAll(client));
};

// get Event client
Campus.prototype._getEventClient = function () {
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

    // check that clients are ready
    if (this.ready !== true) {
        throw new Error('Please call #init() before using this method');
    }

    // function to get the semesters list from the Campus APIs
    var getSemstersListFromCampus = () => {
        details('Get semesters list from Campus');

        // api call
        return this._termClient.GetAllAsync({});
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
Campus.prototype.getStudyFieldsBySemester = function (semester) {
    log('Getting list of study fields for semester: ' + semester.name);

    // check that clients are ready
    if (this.ready !== true) {
        throw new Error('Please call #init() before using this method');
    }

    // function to get the study fields from the Campus APIs
    var getStudyFieldsBySemesterFromCampus = () => {
        details('Get list of study fields for semester from Campus: ' + semester.name);

        // api call
        return this._termClient.GetFieldsAsync({
            'sGuid': semester.gguid
        });
    };

    // check cache!
    if (this.cache) {

        // check in database
        return this.db.getCachedFields(semester.gguid).then(fieldsResponse => {

            // if cached -> return it
            if (fieldsResponse !== null) {
                details('Get list of study fields for semester from Cache: ' + semester.name);
                return fieldsResponse;
            }

            // cache miss -> request from Campus
            else {
                return getStudyFieldsBySemesterFromCampus().then(fieldsResponse => {
                    return this.db.cacheFields(semester.gguid, fieldsResponse).then(_ => fieldsResponse);
                });
            }
        });
    }

    // no cache -> request from Campus
    else {
        return getStudyFieldsBySemesterFromCampus();
    }
};

// get the list of subfields by field of study
Campus.prototype.getSubFields = function (field) {
    log('Getting subfields for field: [' + field.gguid + '] ' + field.name);

    // function to get the subfields from the Campus APIs
    var getSubFieldsFromCampus = () => {
        details('Getting subfields for field from Campus: [' + field.gguid + '] ' + field.name);

        // api call
        return this._fieldClient.GetLinkedAsync({
            'sGuid': field.gguid,
            'bTree': true,              // tree of subfields
            'bIncludeEvents': false     // courses without subfield will be catched later...
        });
    };

    // check cache!
    if (this.cache) {

        // check in database
        return this.db.getCachedSubFields(field.gguid).then(subFieldsResponse => {

            // if cached -> return it
            if (subFieldsResponse !== null) {
                details('Getting subfields for field from Cache: [' + field.gguid + '] ' + field.name);
                return subFieldsResponse;
            }

            // cache miss -> request from Campus
            else {
                return getSubFieldsFromCampus().then(subFieldsResponse => {
                    return this.db.cacheSubFields(field.gguid, subFieldsResponse).then(_ => subFieldsResponse);
                });
            }
        });
    }

    // no cache -> request from Campus
    else {
        return getSubFieldsFromCampus();
    }
};

// get the list of courses by subfield
Campus.prototype.getCoursesBySubfiled = function (subfield) {
    log('Getting courses for subfield: [' + subfield.gguid + '] ' + subfield.name);

    // function to get the subfields from the Campus APIs
    var getCoursesFromCampus = () => {
        details('Getting courses for subfield from Campus: [' + subfield.gguid + '] ' + subfield.name);

        return this._fieldClient.GetLinkedAsync({
            'sGuid': subfield.gguid,
            'bTree': false,             // we do not need the tree of subfields (handled before)
            'bIncludeEvents': true      // get courses
        });
    };

    // check cache!
    if (this.cache) {

        // check in database
        return this.db.getCachedCourses(subfield.gguid).then(coursesListResponse => {

            // if cached -> return it
            if (coursesListResponse !== null) {
                details('Getting courses for subfield from Cache: [' + subfield.gguid + '] ' + subfield.name);
                return coursesListResponse;
            }

            // cache miss -> request from Campus
            else {
                return getCoursesFromCampus().then(coursesListResponse => {
                    return this.db.cacheCourses(subfield.gguid, coursesListResponse).then(_ => coursesListResponse);
                });
            }
        });
    }

    // no cache -> request from Campus
    else {
        return getCoursesFromCampus();
    }
};

// get the details of a course
Campus.prototype.getCourseDetails = function (course) {
    log('Getting course details for course: [' + course.gguid + '] ' + course.name);

    // function to get the subfields from the Campus APIs
    var getCourseDetailsFromCampus = () => {
        details('Getting course details for course from Campus: [' + course.gguid + '] ' + course.name);

        return this._eventClient.GetLinkedAsync({
            'sEvtSpec': course.gguid,
            'bIncludeFields': true,
            'bIncludeAdresses': true,
            'bIncludeAppointments': true,
            'bIncludeUnits': true
        });
    };

    // check cache!
    if (this.cache) {

        // check in database
        return this.db.getCachedCourseDetails(course.gguid).then(courseDetailsResponse => {

            // if cached -> return it
            if (courseDetailsResponse !== null) {
                details('Getting course details for course from Cache: [' + course.gguid + '] ' + course.name);
                return courseDetailsResponse;
            }

            // cache miss -> request from Campus
            else {
                return getCourseDetailsFromCampus().then(courseDetailsResponse => {
                    return this.db.cacheCourses(course.gguid, courseDetailsResponse).then(_ => courseDetailsResponse);
                });
            }
        });
    }

    // no cache -> request from Campus
    else {
        return getCourseDetailsFromCampus();
    }
};

// expose functions
module.exports = Campus;