// const WSDL = 'http://www.campus.rwth-aachen.de/anonapi/Campus.asmx?WSDL';
const WSDL_TERM = 'http://www.campus.rwth-aachen.de/anonapi/TermSrv.asmx?WSDL'
const WSDL_FIELD = 'http://www.campus.rwth-aachen.de/anonapi/FieldSrv.asmx?WSDL';
const WSDL_EVENT = 'http://www.campus.rwth-aachen.de/anonapi/EventSrv.asmx?WSDL';

// this does the magic
var soap = require('soap');

// terms client
soap.createClient(WSDL_TERM, function (err, client) {

    // get all semesters codes (GGUIDS)
    // ordered by time desc
    client.GetAll({}, function (err, result) {
        console.log(result);
    });

    // study-fields for WS 2015/16
    client.GetFields({
        'sGuid': '0x0B473CF286B45B4984CD02565C07D6F8'
    }, function (err, result) {
        console.log(result);
    });
});

// fields client
soap.createClient(WSDL_FIELD, function (err, client) {

    // get all sub-study-b-tree for M.Sc Computer Science
    client.GetLinked({
        'sGuid': '0x04FA11478F05804CA71DBF7573B80160',
        'bTree': true,
        'bIncludeEvents': true
    }, function (err, result) {
        console.log(result);
    });

    // get all courses for M.Sc Computer Science -> Theoretical Informatic
    client.GetLinked({
        'sGuid': '0x614EBE7FF82A6A4E9961C73D0E8FD225',
        'bTree': true,
        'bIncludeEvents': true
    }, function (err, result) {
        console.log(result);
    });
});

// events client
soap.createClient(WSDL_EVENT, function (err, client) {

    // get course detail for one GGUID
    client.GetLinked({
        'sEvtSpec': '0x3D4824C6F312EA4DB691342B824CF9E7',
        'bIncludeFields': false,
        'bIncludeAdresses': false,
        'bIncludeAppointments': false,
        'bIncludeUnits': false
    }, function (err, result) {
        console.log(result);
    });
});