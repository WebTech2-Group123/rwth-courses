// const WSDL = 'http://www.campus.rwth-aachen.de/anonapi/Campus.asmx?WSDL';
const WSDL_TERM = 'http://www.campus.rwth-aachen.de/anonapi/TermSrv.asmx?WSDL'
const WSDL_FIELD = 'http://www.campus.rwth-aachen.de/anonapi/FieldSrv.asmx?WSDL';
const WSDL_EVENT = 'http://www.campus.rwth-aachen.de/anonapi/EventSrv.asmx?WSDL';

// this does the magic
var soap = require('soap');
var Promise = require('bluebird');
var parser = require('./parser');

Promise.promisifyAll(soap);

// Create three different clients
var clients = [WSDL_TERM, WSDL_FIELD, WSDL_EVENT].map(api => {
    return soap.createClientAsync(api);
});

// Wait until all clients are created
Promise.all(clients)
    .then(function (arrayOfClients) {
        // Promisify every single client
        arrayOfClients.map(client => Promise.promisifyAll(client));

        const termClient = arrayOfClients[0];
        const fieldClient = arrayOfClients[1];
        const eventClient = arrayOfClients[2];

        // Api-call to CampusOffice for all Semesters
        termClient.GetAllAsync({})
            // Select the first two semesters
            .then(semesters => parser.parseSemesters(semesters))

            // Api-call to CampusOffice to get all fields of a semester
            .then(semesters => semesters.map(semester => termClient.GetFieldsAsync({'sGuid': semester['gguid']})))

            // Parsing the fields of a semester
            .map(fields => parser.parseFieldOfStudies(fields))

            .then(function (fields) {
                console.log(fields);
            })
    });