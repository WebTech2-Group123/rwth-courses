// this does the magic
const soap = require('soap');
const log = require('debug')('worker');
const parser = require('./parser');
const mongo = require('./mongo');

const info = require('debug')('info');

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
        'bTree': true,              // tree of subfields
        'bIncludeEvents': true      // courses without subfield
    });
}

function getCoursesBySubfiled(fieldClient, subfield) {
    log('Getting courses for subfield: [' + subfield.gguid + '] ' + subfield.name);
    return fieldClient.GetLinkedAsync({
        'sGuid': subfield.gguid,
        'bTree': false,             // we do not need the tree of subfields (handled before)
        'bIncludeEvents': true      // get courses
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

// unwrap clients
Promise.all([getClients(), getCleanDB()]).then(promises => {

    // unwrap mongo
    const db = promises[1];

    // clients for the 3 SOAP endpoints
    const arrayOfClients = promises[0];
    const termClient = arrayOfClients[0];
    const fieldClient = arrayOfClients[1];
    const eventClient = arrayOfClients[2];

    // API-call to CampusOffice for all Semesters
    getSemestersList(termClient)

    // select the first two semesters
        .then(semesters => {
            return parser.parseSemesters(semesters);
        })

        // for each semester -> get all fields
        .map(semester => {
            return getStudyFieldsBySemster(termClient, semester).then(fieldsListResponse => {

                // parse raw response with list of fields
                var fields = parser.parseFieldOfStudies(fieldsListResponse);

                // for each field -> request the subfields
                fields.forEach(field => {

                    // api call
                    getSubFields(fieldClient, field).then(subfieldsResponse => {

                        // parse response
                        var temp = parser.parseSubFields(subfieldsResponse);

                        // raw courses
                        var coursesWithoutSubfield = temp.courses;

                        // subfields
                        var subfields = temp.subfields;

                        // for each subfield -> request list of courses
                        subfields.forEach(subfield => {

                            // api call
                            getCoursesBySubfiled(fieldClient, subfield).then(coursesListResponse => {

                                var alex = 'Julian';

                            });
                        });
                    });
                });
            });
        })

        // TODO: remove
        .then(() => {
            db.db.close();
        });

    //    // parser.parseFieldOfStudies(fieldsResponse).filter(f=> f.name.indexOf('M.Sc') >= 0 || f.name.indexOf('B.Sc') >= 0).filter(f => f.name.indexOf('Infor') >= 0).map(f=> f.name)
    //


    //    // Parsing the fields of a semester
    //    .flatMap(fieldsResponse => {
    //        return parser.parseFieldOfStudies(fieldsResponse);
    //    })
    //
    //    // take only B.Sc and M.Sc
    //    // .filter(f=> f.name.indexOf('M.Sc') >= 0 || f.name.indexOf('B.Sc') >= 0)
    //
    //    // TODO: remove
    //    .filter(f => {
    //        return f.name.indexOf('Informatik') == 0;
    //    });
    //
    //// and request every subfield for it
    //const subfieldsStream = fieldsStream.flatMap(field => {
    //        return getSubFields(fieldClient, field);
    //    })
    //
    //    // parse subfields
    //    .flatMap(subfieldResponse => {
    //        return parser.parseSubFields(subfieldResponse);
    //    });
    //
    //
    //// request courses for each subfield
    //const coursesListStream = subfieldsStream.flatMap(subfiled => {
    //        return getCoursesBySubfiled(fieldClient, subfiled);
    //    })
    //
    //    // parse courses
    //    .flatMap(coursesResponse => {
    //        return parser.parseCoursesList(coursesResponse);
    //    });
    //
    //
    //// get details
    //const coursesDetailsStream = coursesListStream.flatMap(course => {
    //        return getCourseDetails(eventClient, course);
    //    })
    //
    //    // parse details
    //    .map(courseDetailsResponse => {
    //        return parser.parseCourseDetails(courseDetailsResponse);
    //    });
    //
    //// get courses
    //coursesDetailsStream.subscribe(courseDetails => {
    //    log('Course [' + courseDetails.gguid + '] -> ' + '(' + courseDetails.type + ') ' + courseDetails.name);
    //
    //    // TODO: abstracte exams -> https://www.campus.rwth-aachen.de/rwth/all/event.asp?gguid=0xC614382FF182EA4FBFB2110F82F55400
    //    if (typeof courseDetails.type == 'undefined') {
    //        console.log('WARN -> ' + JSON.stringify(courseDetails));
    //    }
    //
    //    // save in mongo
    //    db.insertCourse(courseDetails);
    //});
    //
    ////semestersStream.subscribeOnCompleted(() => {
    ////    info('SEMESTERS -> complete');
    ////});
    ////
    ////fieldsStream.subscribeOnCompleted(() => {
    ////    info('FIELDS -> complete');
    ////});
    ////
    ////subfieldsStream.subscribeOnCompleted(() => {
    ////    info('SUBFIELDS -> complete');
    ////});
    ////
    ////coursesListStream.subscribeOnCompleted(() => {
    ////    info('COURSES LIST -> complete');
    ////});
    //
    ////coursesDetailsStream.subscribeOnCompleted(() => {
    ////    info('COURSES DETAILS -> complete');
    ////
    ////    // TODO -> better
    ////    setTimeout(() => db.db.close(), 3000);
    ////});


});