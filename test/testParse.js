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

const SUB_FIELD_RESPONSE = {
    "field": {
        "attributes": {
            "gguid": "0x04FA11478F05804CA71DBF7573B80160",
            "name": "Informatik (M.Sc.)",
            "termname": "WS 2015/2016"
        },
        "event": [{
            "attributes": {
                "gguid": "0xF2B20848FD1C094BA186DD01AB5A810D",
                "nr": "15ws-19940",
                "termname": "WS 2015/2016",
                "copy": "true",
                "vvz": "false",
                "kvvz": "false",
                "confirmed": "true",
                "notpublished": "false"
            },
            "info": [{
                "attributes": {"lang": "de"},
                "title": "Master-Mentorenprogramm: Keine Präferenz",
                "description": "<p><em>Die Fachgruppe Informatik bietet ein Mentorenprogramm f&#252;r Studierende des Masterstudiengangs Informatik an.</em><br />  <br />  Wenn Sie sich sich f&#252;r <strong>keinen </strong>der vier Kernbereiche entscheiden k&#246;nnen, dann&#160; melden Sie sich &#252;ber das <strong>Online-Anmeldeverfahren</strong> in dieser Gruppe an.</p>  <br />  Nach Ablauf der Anmeldefrist werden Sie von Ihrem Mentor angeschrieben  (typisch per E-Mail), der Sie dann zu einem ersten Mentorengespr&#228;ch  einladen wird."
            }],
            "link": [{
                "attributes": {
                    "type": "Homepage",
                    "href": "http://www.informatik.rwth-aachen.de/Studierende/Master/Mentorenprogramm/"
                }
            }],
            "l2p": {"attributes": {"use": "false", "reset": "false", "lang": "0"}}
        }],
        "group": "Master of Science (M.Sc.)",
        "fieldname": "Informatik (M.Sc.)",
        "email": "master@informatik.rwth-aachen.de",
        "subfield": [{
            "attributes": {
                "gguid": "0x614EBE7FF82A6A4E9961C73D0E8FD225",
                "parent": "0x04FA11478F05804CA71DBF7573B80160",
                "name": "Theoretische Informatik",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Informatik (M.Sc.)",
            "path": "Theoretische Informatik"
        }, {
            "attributes": {
                "gguid": "0x3CCB5D7BDC7AB6498ED7EF758ABFF60E",
                "parent": "0x04FA11478F05804CA71DBF7573B80160",
                "name": "Software und Kommunikation",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Informatik (M.Sc.)",
            "path": "Software und Kommunikation"
        }, {
            "attributes": {
                "gguid": "0x50EFF8C3BB25FD40AEF861C09AC91085",
                "parent": "0x04FA11478F05804CA71DBF7573B80160",
                "name": "Daten- und Informationsmanagement",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Informatik (M.Sc.)",
            "path": "Daten- und Informationsmanagement"
        }, {
            "attributes": {
                "gguid": "0xE58DDCB978840545804E19AD80F4C49F",
                "parent": "0x04FA11478F05804CA71DBF7573B80160",
                "name": "Angewandte Informatik",
                "termname": "WS 2015/2016"
            }, "group": "Master of Science (M.Sc.)", "fieldname": "Informatik (M.Sc.)", "path": "Angewandte Informatik"
        }, {
            "attributes": {
                "gguid": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                "parent": "0x04FA11478F05804CA71DBF7573B80160",
                "name": "Anwendungsfächer",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Informatik (M.Sc.)",
            "subfield": [{
                "attributes": {
                    "gguid": "0x3174786BC014774C9EB96D42EC160704",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Biologie",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Biologie"
            }, {
                "attributes": {
                    "gguid": "0x4AA276222301AF4FB0CF35175F81A0F3",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Betriebswirtschaftslehre",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Betriebswirtschaftslehre"
            }, {
                "attributes": {
                    "gguid": "0x1780693D038BAF47A6C931E8909AA72F",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Elektrotechnik",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Elektrotechnik"
            }, {
                "attributes": {
                    "gguid": "0x499FB7BF1F6F07499892DC32E6509747",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Mathematik",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Mathematik"
            }, {
                "attributes": {
                    "gguid": "0x5214C3C4C80C5C4FA470F83DAB19FEB3",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Maschinenbau",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Maschinenbau"
            }, {
                "attributes": {
                    "gguid": "0x12832CC7CE71C940B949826F9BBA8616",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Medizin",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Medizin"
            }, {
                "attributes": {
                    "gguid": "0x8A61CD534921F148A7FF5F897A623737",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Physik",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Physik"
            }, {
                "attributes": {
                    "gguid": "0xDDE6604347C76046BBA3F5826095CA31",
                    "parent": "0x22401D3DDB6FF04F8959C2DC0154CE4B",
                    "name": "Philosophie",
                    "termname": "WS 2015/2016"
                },
                "group": "Master of Science (M.Sc.)",
                "fieldname": "Informatik (M.Sc.)",
                "path": "Anwendungsfächer/Philosophie"
            }],
            "path": "Anwendungsfächer"
        }, {
            "attributes": {
                "gguid": "0x95C39BAE6C0BEA4982AC283EB2FE0051",
                "parent": "0x04FA11478F05804CA71DBF7573B80160",
                "name": "Zusatzveranstaltungen",
                "termname": "WS 2015/2016"
            }, "group": "Master of Science (M.Sc.)", "fieldname": "Informatik (M.Sc.)", "path": "Zusatzveranstaltungen"
        }]
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

        describe('#parseFieldOfStudies()', function () {
            it('should return all field of studies of a specific semester', function () {
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

        describe('#parseSubFields()', function() {
            it('should return an array of subfields of specific field of study', function(){
                var subfields = parser.parseSubFields(SUB_FIELD_RESPONSE);
                const SUB_FIELD = {
                    gguid: '0x614EBE7FF82A6A4E9961C73D0E8FD225',
                    name: 'Theoretische Informatik'
                };

                assert.deepEqual(subfields[0], SUB_FIELD);
                assert.equal(subfields.length, 6);
            })
        })
    }
)
;
