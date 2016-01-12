// const WSDL = 'http://www.campus.rwth-aachen.de/anonapi/Campus.asmx?WSDL';
const WSDL = 'http://www.campus.rwth-aachen.de/anonapi/EventSrv.asmx?WSDL';

var soap = require('soap');
var url = WSDL;
soap.createClient(url, function (err, client) {

    // get course detail for one GGUID
    client.GetLinked({
        'sEvtSpec': '0x3D4824C6F312EA4DB691342B824CF9E7',
        'bIncludeFields': false,
        'bIncludeAdresses': false,
        'bIncludeAppointments': false,
        'bIncludeUnits': false
    }, function (err, result) {
        console.log(result.statusCode);
        console.log(result.body);
    });
});