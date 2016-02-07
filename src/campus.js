'use strict';

// this does the magic
const soap = require('soap');
const Promise = require('bluebird');

// logs
const log = require('debug')('rwth-courses:campus');
const cache = require('debug')('rwth-courses:campus:cache');
const proxy = require('debug')('rwth-courses:campus:proxy');

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
Campus.prototype.init = function (cacheOnly) {
    log('Init: create all clients. CacheOnly: ' + cacheOnly);

    // if cacheOnly (ONLY DEVELOPMENT)
    if (cacheOnly === true) {
        this.ready = true;
        return Promise.resolve();
    }

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
    const LOG = 'Get semesters list';

    // check that clients are ready
    if (this.ready !== true) {
        throw new Error('Please call #init() before using this method');
    }

    // function to get the semesters list from the Campus APIs
    var getSemstersListFromCampus = () => {
        proxy(LOG);

        // api call
        return this._termClient.GetAllAsync({});
    };

    // check cache!
    if (this.cache) {

        // check in database
        return this.db.getCachedSemesters().then(semestersResponse => {

            // if cached -> return it
            if (semestersResponse !== null) {
                cache(LOG);
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
    const LOG = 'Getting list of study fields for semester: ' + semester.name;

    // check that clients are ready
    if (this.ready !== true) {
        throw new Error('Please call #init() before using this method');
    }

    // function to get the study fields from the Campus APIs
    var getStudyFieldsBySemesterFromCampus = () => {
        proxy(LOG);

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
                cache(LOG);
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
    const LOG = 'Getting subfields for field: [' + field.gguid + '] ' + field.name;

    // function to get the subfields from the Campus APIs
    var getSubFieldsFromCampus = () => {
        proxy(LOG);

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
                cache(LOG);
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
    const LOG = 'Getting courses for subfield: [' + subfield.gguid + '] ' + subfield.name;

    // function to get the subfields from the Campus APIs
    var getCoursesFromCampus = () => {
        proxy(LOG);

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
                cache(LOG);
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
    const LOG = 'Getting course details for course: [' + course.gguid + '] ' + course.name;

    // function to get the subfields from the Campus APIs
    var getCourseDetailsFromCampus = () => {
        proxy(LOG);

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
                cache(LOG);
                return courseDetailsResponse;
            }

            // cache miss -> request from Campus
            else {
                return getCourseDetailsFromCampus().then(courseDetailsResponse => {
                    return this.db.cacheCourseDetails(course.gguid, courseDetailsResponse).then(_ => courseDetailsResponse);
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