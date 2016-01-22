// this does the magic
const soap = require('soap');
const log = require('debug')('worker');
const parser = require('./parser');
const mongo = require('./mongo');

var Rx = require('rx');

// TODO: move to better place
// make sure not-handled rejected Promises throw an error
const Promise = require('bluebird');
process.on("unhandledRejection", function (error) {
    throw error;
});

// APIs' endpoints
const WSDL_TERM = 'http://www.campus.rwth-aachen.de/anonapi/TermSrv.asmx?WSDL';
const WSDL_FIELD = 'http://www.campus.rwth-aachen.de/anonapi/FieldSrv.asmx?WSDL';
const WSDL_EVENT = 'http://www.campus.rwth-aachen.de/anonapi/EventSrv.asmx?WSDL';

// utils functions
function getClients() {

    // make 'soap' library Promise-friendly
    Promise.promisifyAll(soap);

    // create three different clients
    const clients = [WSDL_TERM, WSDL_FIELD, WSDL_EVENT]
        .map(endpoint => soap.createClientAsync(endpoint));

    // wait until all clients are created
    return Promise.all(clients)

        // promisify every single client
        .each(client => Promise.promisifyAll(client));
}

function getSemestersList(termClient) {
    log('Getting semesters list');
    return termClient.GetAllAsync({});
}

function getStudyFieldsBySemster(termClient, semester) {
    log('Getting list of study fields for semester: ' + semester.name);
    return termClient.GetFieldsAsync({
        'sGuid': semester.gguid
    });
}

function getSubFields(fieldClient, field) {
    log('Getting subfields for field: [' + field.gguid + '] ' + field.name);
    return fieldClient.GetLinkedAsync({
        'sGuid': field.gguid,
        'bTree': true,              // get subFields
        'bIncludeEvents': true      // not useful ???
    });
}

function getCoursesBySubfiled(fieldClient, subfield) {
    log('Getting courses for subfield: [' + subfield.gguid + '] ' + subfield.name);
    return fieldClient.GetLinkedAsync({
        'sGuid': subfield.gguid,
        'bTree': true,
        'bIncludeEvents': true
    });
}

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

function getCleanDB() {
    return mongo.createClient().then(db => {
        return db.renameTempCourses().then(_ => db);
    })
}

// TODO: remove
const N = 30;

// unwrap clients
Promise.all([
    getClients()
    , getCleanDB()
]).then(promises => {

    // unwrap mongo
    const db = promises[1];

    // clients for the 3 SOAP endpoints
    const arrayOfClients = promises[0];
    const termClient = arrayOfClients[0];
    const fieldClient = arrayOfClients[1];
    const eventClient = arrayOfClients[2];

    // API-call to CampusOffice for all Semesters
    const coursesStream = Rx.Observable.fromPromise(getSemestersList(termClient))

        // select the first two semesters
        .flatMap(semesters => {
            return parser.parseSemesters(semesters);
        })

        // Api-call to CampusOffice to get all fields of a semester
        .flatMap(semester => {
            return getStudyFieldsBySemster(termClient, semester);
        })

        // Parsing the fields of a semester
        .flatMap(fieldsResponse => {
            return parser.parseFieldOfStudies(fieldsResponse);
        })

        // TODO: remove
        .take(N)

        .throttle(1)

        // and request every subfield for it
        .flatMap(field => {
            return getSubFields(fieldClient, field);
        })

        // TODO: remove
        .take(N)

        //.throttle(10)

        // parse subfields
        .flatMap(subfieldResponse => {
            return parser.parseSubFields(subfieldResponse);
        })

        // request courses for each subfield
        .flatMap(subfiled => {
            return getCoursesBySubfiled(fieldClient, subfiled);
        })

        // parse courses
        .flatMap(coursesResponse => {
            return parser.parseCoursesList(coursesResponse);
        })

        // get details
        .flatMap(course => {
            return getCourseDetails(eventClient, course);
        })

        // parse details
        .map(courseDetailsResponse => {
            return parser.parseCourseDetails(courseDetailsResponse);
        });

    // get courses
    coursesStream.subscribe(courseDetails => {
        log('Course [' + courseDetails.gguid + '] -> ' + '(' + courseDetails.type + ') ' + courseDetails.name);

        // TODO: abstracte exams -> https://www.campus.rwth-aachen.de/rwth/all/event.asp?gguid=0xC614382FF182EA4FBFB2110F82F55400
        if (typeof courseDetails.type == 'undefined') {
            console.log('WARN -> ' + JSON.stringify(courseDetails));
        }

        // save in mongo
        db.insertCourse(courseDetails);
    });

    coursesStream.subscribeOnCompleted(() => {
        console.log('========> subscribeOnCompleted');

        // TODO -> better
        setTimeout(() => db.db.close(), 3000);

    })


});