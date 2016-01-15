var assert = require('assert');
var parser = require('../src/parser');

const SEMESTERS_RESPONSE = {
    "GetAllResult": {
        "Term": [
            {
                "attributes": {
                    "gguid": "0x0B473CF286B45B4984CD02565C07D6F8",
                    "start": "2015-10-01T00:00:00",
                    "end": "2016-03-31T23:59:59",
                    "lectstart": "2015-10-19T00:00:00",
                    "lectend": "2016-02-12T23:59:59",
                    "name": "WS 2015/2016"
                }
            },
            {
                "attributes": {
                    "gguid": "0xBA76F399D1893541BFCF7CBC6BAFE455",
                    "start": "2015-04-01T00:00:00",
                    "end": "2015-09-30T23:59:59",
                    "lectstart": "2015-04-07T00:00:00",
                    "lectend": "2015-07-17T23:59:59",
                    "name": "SS 2015"
                }
            },
            {
                "attributes": {
                    "gguid": "0xD11C175C48B04C4D843AF4D066CD4661",
                    "start": "2014-10-01T00:00:00",
                    "end": "2015-03-31T23:59:59",
                    "lectstart": "2014-10-06T00:00:00",
                    "lectend": "2015-02-06T23:59:59",
                    "name": "WS 2014/2015"
                }
            }
        ]
    }
};

const FIELD_RESPONSE =
{
    "GetFieldsResult": {
        "Field": [
            {
                "attributes": {
                    "gguid": "0x5A266C5046CF0E46AFFEBA62F34B5F85",
                    "name": "Architektur (D)",
                    "termname": "WS 2015/2016"
                },
                "group": "Diplomstudiengänge (D)",
                "fieldname": "Architektur (D)",
                "email": "klinkhammer@architektur.rwth-aachen.de"
            },
            {
                "attributes": {
                    "gguid": "0xEFD420E5D2646C41BFC83FE2A1F152E9",
                    "name": "Bauingenieurwesen (D)",
                    "termname": "WS 2015/2016"
                },
                "group": "Diplomstudiengänge (D)",
                "fieldname": "Bauingenieurwesen (D)",
                "notes": "Studierende der Studienrichtung &quot;Vertiefung nach freier Wahl&quot; k&ouml;nnen unter Ber&uuml;cksichtigung der in DPO 98 und DPO 2004 festgelegten Regeln den Pr&uuml;fungsplan aus den F&auml;chern der anderen Studienrichtungen frei zusammenstellen.",
                "email": "lehrveranstaltungsmanagement@fb3.rwth-aachen.de"
            }
        ]
    }
};

describe('parse.js', function () {
    describe('#parseSemesters()', function () {
        it('should return the last 2 semsters (current and last one)', function () {
            var semesters = parser.parseSemesters(SEMESTERS_RESPONSE);
            const SEMESTER_1 = {
                gguid: '0x0B473CF286B45B4984CD02565C07D6F8',
                name: 'WS 2015/2016',
                start: new Date('2015-10-01T00:00:00')
            };
            const SEMESTER_2 = {
                gguid: '0xBA76F399D1893541BFCF7CBC6BAFE455',
                name: 'SS 2015',
                start: new Date('2015-04-01T00:00:00')
            };
            assert.deepEqual(semesters[0], SEMESTER_1);
            assert.deepEqual(semesters[1], SEMESTER_2);
        });
    });

    describe('#parseFieldOfStudies()', function(){
        it('should return all field of studies of the selected semester', function() {
            var fields = parser.parseFieldOfStudies(FIELD_RESPONSE);
            const FIELD = {
                gguid: '0x5A266C5046CF0E46AFFEBA62F34B5F85',
                name: 'Architektur (D)',
                semester: 'WS 2015/2016'
            };

            assert.deepEqual(fields[0], FIELD);
            assert.equal(fields.length, 2);
        });
    });
});
