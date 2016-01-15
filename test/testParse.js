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

const COURSES_LIST_RESPONSE = {
    "field": {
        "attributes": {
            "gguid": "0x614EBE7FF82A6A4E9961C73D0E8FD225",
            "name": "Theoretische Informatik",
            "termname": "WS 2015/2016"
        },
        "event": [
            {
                "attributes": {
                    "gguid": "0x008FFF190AD4614A8BBF5592EABB52AF",
                    "nr": "15ws-46810",
                    "termname": "WS 2015/2016",
                    "type": "Seminar (S)",
                    "sws": "2",
                    "ects": "4",
                    "language": "English",
                    "copy": "false",
                    "vvz": "false",
                    "kvvz": "false",
                    "confirmed": "true",
                    "notpublished": "false"
                },
                "info": [
                    {
                        "attributes": {
                            "lang": "gb"
                        },
                        "title": "Seminar Computational Complexity Theory"
                    },
                    {
                        "attributes": {
                            "lang": "de"
                        },
                        "title": "Seminar Komplexitätstheorie"
                    }
                ],
                "link": [
                    {
                        "attributes": {
                            "type": "Homepage",
                            "href": "https://www.lii.rwth-aachen.de/de/2-uncategorised/90-complexity-seminar-ws-2015-16.html"
                        }
                    }
                ],
                "l2p": {
                    "attributes": {
                        "use": "true",
                        "reset": "false",
                        "lang": "1033"
                    }
                }
            },
            {
                "attributes": {
                    "gguid": "0x0144A6E4B414274EAD37B7631F2B088F",
                    "nr": "15ws-45349",
                    "termname": "WS 2015/2016",
                    "type": "Vorlesung (V)",
                    "sws": "3",
                    "ects": "6",
                    "language": "Deutsch oder Englisch",
                    "copy": "true",
                    "vvz": "true",
                    "kvvz": "true",
                    "confirmed": "true",
                    "notpublished": "false"
                },
                "test": "<span><span>\r\n<p>Zuordnung: Wahlpflichtfach Theoretische Informatik  (f&#252;r Bachelor),</p>\r\n<p>Theoretische Informatik (f&#252;r Master Informatik),</p>\r\n<p>Theoretische Informatik &#38; Informatik Vertiefung  (f&#252;r Master SSE)</p>\r\n</span></span>",
                "prereq": "&#160;Grundkenntnisse in \"Programmierung\" sind ausreichend.<br /> \r\n<ul>\r\n<li>Da es sich um eine \"einf&#252;hrende Master-Veranstaltung\" handelt, kann sie auch als  Bachelor-Wahlpflichtveranstaltung (Theorie) im Studiengang Bachelor Informatik geh&#246;rt werden.</li>\r\n<li>Ebenso ist es m&#246;glich, die Vorlesung bereits im Bachelor-Studiengang    zu h&#246;ren und zu pr&#252;fen und sie sich sp&#228;ter f&#252;r den    Master-Studiengang  anerkennen zu lassen. </li>\r\n</ul>",
                "otherevents": "<ul>\r\n<li>&#220;bung \"Termersetzungssysteme\"</li>\r\n<li>Seminar \"Termersetzungssysteme - Aktuelle Themen und Erweiterungen\" </li>\r\n</ul>",
                "literature": "<p>Das Skript zur Vorlesung wird elektronisch zur Verf&#252;gung gestellt.</p>\r\n<p>Weitere Literatur:</p>\r\n<ul>\r\n<li>J. Avenhaus. Reduktionssysteme. Springer-Verlag, 1995. </li>\r\n<li> F. Baader und T. Nipkow: Term Rewriting and All That, Cambridge  University Press, 1998. </li>\r\n<li>R. B&#252;ndgen: Termersetzungssysteme, Vieweg, 1998.</li>\r\n<li>N. Dershowitz and J.-P. Jouannaud. Rewrite Systems. Handbook of  Theoretical Computer Science, Vol. B, Chapter 6: Formal Methods and  Semantics, J. van Leeuwen (ed.), North-Holland, pp. 243-320, 1990. </li>\r\n<li>Terese. Term Rewriting Systems. Cambridge University Press, 2003. </li>\r\n<li> E. Ohlebusch. Advanced Topic in Term Rewriting. Springer-Verlag, 2002. </li>\r\n</ul>\r\n<p>&#160;</p>",
                "info": [
                    {
                        "attributes": {
                            "lang": "gb"
                        },
                        "title": "Term Rewriting Systems",
                        "description": "Term rewriting systems are used for computations and mechanized proofs with       equations. All functional programming languages are based on term       rewriting systems, too. Therefore, term rewriting systems are used       in many areas like mechanized program verification, specification       of programs and declarative programming. The following questions       will be discussed in the course.      \r\n<ul>\r\n<li>Is the result of a computation always unique (confluence)?</li>\r\n<li>Does a computation always stop after a finite number of steps (termination)?</li>\r\n<li>Does a program fulfill its specification (correctness)?</li>\r\n<li>How can the completion of an incomplete program be handled automatically?</li>\r\n</ul>"
                    },
                    {
                        "attributes": {
                            "lang": "de"
                        },
                        "title": "Termersetzungssysteme",
                        "description": "Termersetzungssysteme dienen zum Rechnen und automatischen Beweisen mit  Gleichungen. Au&#223;erdem sind Termersetzungssysteme die  Basis-Programmiersprache, die allen funktionalen Programmiersprachen  zugrunde liegt. Termersetzungssysteme werden daher in vielen Bereichen  wie der automatisierten Programmverifikation, der Spezifikation von  Programmen und der deklarativen Programmierung eingesetzt. In der  Vorlesung werden Verfahren vorgestellt, um folgende Fragestellungen  rechnergest&#252;tzt zu untersuchen:\r\n<ul>\r\n<li> Ist das Resultat eines Programms immer eindeutig (Konfluenz)?</li>\r\n<li> H&#228;lt ein Programm immer nach endlich vielen Schritten an  (Terminierung)?</li>\r\n<li> Erf&#252;llt ein Programm seine Spezifikation (Korrektheit)?</li>\r\n<li> Wie kann man ein unvollst&#228;ndiges Programm automatisch  vervollst&#228;ndigen?</li>\r\n</ul>"
                    }
                ],
                "link": [
                    {
                        "attributes": {
                            "type": "Homepage",
                            "href": "http://verify.rwth-aachen.de/tes15/"
                        }
                    }
                ],
                "l2p": {
                    "attributes": {
                        "use": "false",
                        "reset": "false",
                        "lang": "0"
                    }
                }
            },
            {
                "attributes": {
                    "gguid": "0x0251387029BED343932B2092EBD3FBDA",
                    "nr": "15ws-47551",
                    "termname": "WS 2015/2016",
                    "type": "Klausur (Kl)",
                    "copy": "false",
                    "vvz": "true",
                    "kvvz": "true",
                    "confirmed": "true",
                    "notpublished": "false"
                },
                "otherevents": "<span><span>Vorlesung und &#220;bung Algorithmen zur String-Verarbeitung und Techniken zur Datenkompression<br /></span></span>",
                "info": [
                    {
                        "attributes": {
                            "lang": "gb"
                        },
                        "title": "2nd Exam String Processing Algorithms and Data Compression Techniques"
                    },
                    {
                        "attributes": {
                            "lang": "de"
                        },
                        "title": "2. Klausur Algorithmen zur String-Verarbeitung und Techniken zur Datenkompression"
                    }
                ],
                "link": [
                    {
                        "attributes": {
                            "type": "Homepage",
                            "href": ""
                        }
                    }
                ],
                "l2p": {
                    "attributes": {
                        "use": "false",
                        "reset": "false",
                        "lang": "0"
                    }
                }
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

        describe('#parseSubFields()', function () {
            it('should return an array of subfields of specific field of study', function () {
                var subfields = parser.parseSubFields(SUB_FIELD_RESPONSE);
                const SUB_FIELD = {
                    gguid: '0x614EBE7FF82A6A4E9961C73D0E8FD225',
                    name: 'Theoretische Informatik'
                };

                assert.deepEqual(subfields[0], SUB_FIELD);
                assert.equal(subfields.length, 6);
            })
        });

        describe('#parseCoursesList()', function () {
            it('should return an array of GGUIDs of courses for a specific subfield of study', function () {
                var courses = parser.parseCoursesList(COURSES_LIST_RESPONSE);
                const GGUIDS = [
                    '0x008FFF190AD4614A8BBF5592EABB52AF',
                    '0x0144A6E4B414274EAD37B7631F2B088F',
                    '0x0251387029BED343932B2092EBD3FBDA'
                ];

                assert.deepEqual(courses, GGUIDS);
            })
        });
    }
)
;
