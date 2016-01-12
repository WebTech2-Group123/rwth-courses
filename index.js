// const WSDL = 'http://www.campus.rwth-aachen.de/anonapi/Campus.asmx?WSDL';
const WSDL_FIELD = 'http://www.campus.rwth-aachen.de/anonapi/FieldSrv.asmx?WSDL';
const WSDL_EVENT = 'http://www.campus.rwth-aachen.de/anonapi/EventSrv.asmx?WSDL';

var soap = require('soap');

// fields client
soap.createClient(WSDL_FIELD, function (err, client) {

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