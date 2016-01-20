// this does the magic
const soap = require('soap');
const log = require('debug')('worker');
const parser = require('./parser');

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
        'bIncludeEvents': false     // not useful
    });
}

// unwrap clients
getClients().then(arrayOfClients => {

    // clients for the 3 SOAP endpoints
    const termClient = arrayOfClients[0];
    const fieldClient = arrayOfClients[1];
    const eventClient = arrayOfClients[2];

    // API-call to CampusOffice for all Semesters
    getSemestersList(termClient)

    // select the first two semesters
        .then(semesters => parser.parseSemesters(semesters))

        // Api-call to CampusOffice to get all fields of a semester
        .map(semester => getStudyFieldsBySemster(termClient, semester))

        // Parsing the fields of a semester
        // and request every subfield for it
        .map(fieldsResponse => {
            var fields = parser.parseFieldOfStudies(fieldsResponse);
            return fields.map(field => getSubFields(fieldClient, field));



        })

        .then(x => {
            console.log(x);
        })


        // TODO!
        .map(subfields => {
            subfields.forEach(s => {
                s.then(x => log('Subfield: '));
            });
            //console.log(subfields);
        });
});