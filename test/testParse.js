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

const COURSE_DETAILS = {
    "event": {
        "attributes": {
            "gguid": "0x3D4824C6F312EA4DB691342B824CF9E7",
            "nr": "15ws-14118",
            "termname": "WS 2015/2016",
            "type": "Vorlesung/Praktikum/Seminar (VPS)",
            "sws": "3+2",
            "ects": "6",
            "language": "English",
            "copy": "true",
            "vvz": "true",
            "kvvz": "true",
            "confirmed": "true",
            "notpublished": "false"
        },
        "address": [{
            "attributes": {
                "gguid": "0x8B172033EB00D611BDB70002A5871170",
                "addressterm": "Herrn",
                "addressletter": "Sehr geehrter Herr Professor",
                "type": "ADDRESS"
            },
            "christianname": "Ulrik",
            "name": "Schroeder",
            "titlefront": "Dr.-Ing.",
            "salutation": "Universitätsprofessor Dr.-Ing. Ulrik Schroeder",
            "consultationhour": "Do. 11:30-12:30 nach vorheriger Anmeldung per eMail",
            "function": "Prof",
            "work": {
                "attributes": {"office": "6310", "building": "Informatikzentrum (E2) - 2356"},
                "street": "Ahornstraße 55",
                "zip": "52074",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "Lehr- und Forschungsgebiet Informatik 9 (Lerntechnologien)"
            },
            "phone": [{"attributes": {"type": "Reception", "number": "0151 14042553"}}, {
                "attributes": {
                    "type": "Mobile 2",
                    "number": "21930"
                }
            }, {"attributes": {"type": "Work", "number": "+49 241 80 21930"}}, {
                "attributes": {
                    "type": "Work 2",
                    "number": "+49 241 80 21931"
                }
            }, {"attributes": {"type": "FAX Work", "number": "+49 241 80 621931"}}],
            "mail": [{"attributes": {"type": "Email 1", "mail": "schroeder@informatik.rwth-aachen.de"}}],
            "www": [{"attributes": {"type": "Homepage", "href": "learntech.rwth-aachen.de/"}}]
        }, {
            "attributes": {
                "gguid": "0x7B48F69B3AB98047B5808F93667CDD84",
                "addressterm": "Herrn",
                "addressletter": "Sehr geehrter Herr",
                "type": "ADDRESS"
            },
            "christianname": "Usman",
            "name": "Wahid",
            "titleback": "M. Sc. RWTH",
            "salutation": "Usman Wahid M. Sc. RWTH",
            "work": {
                "attributes": {"office": "6309", "building": "Gebäude Informatikzentrum (E2)"},
                "street": "Ahornstrasse 55",
                "zip": "52074",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "CiL Center for Innovative Learning Technologies"
            },
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 21952"}}, {
                "attributes": {
                    "type": "FAX Work",
                    "number": "+49 241 80 621931"
                }
            }],
            "mail": [{"attributes": {"type": "Email 1", "mail": "wahid@cil.rwth-aachen.de"}}],
            "www": [{"attributes": {"type": "Homepage", "href": "http://www.cil.rwth-aachen.de/ueber_uns/team"}}]
        }, {
            "attributes": {"gguid": "0x326AE37D8EA7C54687BF421DCD9198D4", "type": "ADDRESS"},
            "christianname": "Informatik",
            "name": "Stundenplaner",
            "salutation": "Informatik Stundenplaner",
            "work": {
                "street": "Ahornstr. 55",
                "zip": "52074",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "Fachgruppe Informatik"
            },
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 21130"}}],
            "mail": [{"attributes": {"type": "Email 1", "mail": "rossmanith@informatik.rwth-aachen.de"}}]
        }, {
            "attributes": {
                "gguid": "0xF92FD44AAB89584FA2F8C708A688A0E5",
                "addressterm": "Herrn",
                "addressletter": "Sehr geehrter Herr",
                "type": "ADDRESS"
            },
            "christianname": "Arham",
            "name": "Muslim",
            "titleback": "M. Sc. RWTH",
            "salutation": "Arham Muslim M. Sc. RWTH",
            "work": {
                "attributes": {"office": "6309", "building": "Gebäude Informatikzentrum (E2)"},
                "street": "Ahornstrasse 55",
                "zip": "52074",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "CiL Center for Innovative Learning Technologies"
            },
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 21952"}}, {
                "attributes": {
                    "type": "FAX Work",
                    "number": "+49 241 80 621931"
                }
            }],
            "mail": [{"attributes": {"type": "Email 1", "mail": "muslim@cil.rwth-aachen.de"}}],
            "www": [{"attributes": {"type": "Homepage", "href": "http://www.cil.rwth-aachen.de/ueber_uns/team"}}]
        }, {
            "attributes": {"gguid": "0xE95C7531BF9BD511BDAF0002A5871170", "type": "ADDRESS"},
            "name": "Raumvergabe",
            "salutation": "Raumvergabe",
            "work": {
                "attributes": {"building": "Technisches Dezernat"},
                "street": "Süsterfeldstraße 65",
                "zip": "52072",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "Abteilung 10.5 - Infrastrukturelles Gebäudemanagement"
            },
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 94380"}}],
            "mail": [{"attributes": {"type": "Email 1", "mail": "raumvergabe@zhv.rwth-aachen.de"}}]
        }, {
            "attributes": {
                "gguid": "0x707EC1F522A00340A3A09EC775A6A940",
                "addressterm": "Herrn",
                "addressletter": "Sehr geehrter Herr",
                "type": "ADDRESS"
            },
            "christianname": "Hendrik",
            "name": "Thüs",
            "titlefront": "Dipl.-Inform.",
            "salutation": "Dipl.-Inform. Hendrik Thüs",
            "consultationhour": "nach Voranmeldung",
            "work": {
                "attributes": {"office": "6304", "building": "Informatikzentrum (E2) - 2356"},
                "street": "Ahornstraße 55",
                "zip": "52074",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "Lehr- und Forschungsgebiet Informatik 9 (Lerntechnologien)"
            },
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 21932"}}, {
                "attributes": {
                    "type": "FAX Work",
                    "number": "+49 241 80 22930"
                }
            }],
            "mail": [{"attributes": {"type": "Email 1", "mail": "thues@cs.rwth-aachen.de"}}],
            "www": [{"attributes": {"type": "Homepage", "href": "http://learntech.rwth-aachen.de"}}]
        }, {
            "attributes": {
                "gguid": "0x1E984C3B818E5C46A739975B992AFADE",
                "addressterm": "Herrn",
                "addressletter": "Sehr geehrter Herr Dr.",
                "type": "ADDRESS"
            },
            "christianname": "Mohamed Amine",
            "name": "Chatti",
            "titlefront": "Dr. rer. nat.",
            "salutation": "Dr. rer. nat. Mohamed Amine Chatti",
            "work": {
                "attributes": {"office": "6306", "building": "Informatikzentrum (E2) - 2356"},
                "street": "Ahornstraße 55",
                "zip": "52074",
                "town": "Aachen",
                "company": "RWTH Aachen",
                "company2": "Lehrstuhl für Informatik 5 (Informationssysteme und Datenbanken)"
            },
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 21939"}}, {
                "attributes": {
                    "type": "FAX Work",
                    "number": "+49 241 80 621931"
                }
            }],
            "mail": [{"attributes": {"type": "Email 1", "mail": "chatti@informatik.rwth-aachen.de"}}],
            "www": [{"attributes": {"type": "Homepage", "href": "http://learntech.rwth-aachen.de/chatti"}}]
        }, {
            "attributes": {
                "gguid": "0xABC03CD7C8602D45B9E2B2F3F71921CE",
                "addressterm": "Herrn",
                "addressletter": "Sehr geehrter Herr",
                "type": "ADDRESS"
            },
            "christianname": "Vlatko",
            "name": "Lukarov",
            "titleback": "M. Sc. RWTH",
            "salutation": "Vlatko Lukarov M. Sc. RWTH",
            "phone": [{"attributes": {"type": "Work", "number": "+49 241 80 21952"}}, {
                "attributes": {
                    "type": "FAX Work",
                    "number": "+49 241 80 621931"
                }
            }],
            "mail": [{"attributes": {"type": "Email 1", "mail": "lukarov@cil.rwth-aachen.de"}}],
            "www": [{"attributes": {"type": "Homepage", "href": "http://www.cil.rwth-aachen.de/ueber_uns/team"}}]
        }],
        "field": [{
            "attributes": {
                "gguid": "0x5C7E4F5493642A47AC1512F51D5C1D87",
                "name": "Computer Based Learning",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Software Systems Engineering (M.Sc.)",
            "path": "[MPO2005] Areas of Specialization/Computer Based Learning"
        }, {
            "attributes": {
                "gguid": "0xF78ABA6E7FBDDC4A8A2031B2D1C5073D",
                "name": "Daten- und Informationsmanagement",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "TK 2. Fach-Grundlagen der Informatik (M.Sc.)",
            "path": "Wahlpflicht Informatik/Daten- und Informationsmanagement"
        }, {
            "attributes": {
                "gguid": "0x202EFF73F1A7F043B7F5A6B88836DADF",
                "name": "Data and Information Management",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Software Systems Engineering (M.Sc.)",
            "path": "Data and Information Management"
        }, {
            "attributes": {
                "gguid": "0xD14670911E404B46A601C9D2F9F214EA",
                "name": "in Aachen",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Media Informatics (M.Sc.)",
            "path": "Multimedia-Technologie/in Aachen"
        }, {
            "attributes": {
                "gguid": "0xA378C6D3DEF2FA4FAF310DC8D1D408D2",
                "name": "B. Praktische Informatik",
                "termname": "WS 2015/2016"
            },
            "group": "Staatsexamen Lehramtstudiengänge (GYM+GS,BK,SII)",
            "fieldname": "Informatik (GYM+GS,SII)",
            "path": "Hauptstudium/B. Praktische Informatik"
        }, {
            "attributes": {
                "gguid": "0x50EFF8C3BB25FD40AEF861C09AC91085",
                "name": "Daten- und Informationsmanagement",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Informatik (M.Sc.)",
            "path": "Daten- und Informationsmanagement"
        }, {
            "attributes": {
                "gguid": "0x9B5E5DD6B426534B93F5F222F23DF1AC",
                "name": "[MPO2010] Data and Information Management",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Software Systems Engineering (M.Sc.)",
            "path": "[MPO2010] Data and Information Management"
        }, {
            "attributes": {
                "gguid": "0x31E8F025CBC7BF49A2F53F0FF3C29B59",
                "name": "Daten- und Informationsmanagement",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Education (GyGe)(ab WS 2014/15)",
            "fieldname": "Informatik (MEd-GyGe)",
            "path": "Wahlpflicht Fachwissenschaft/Daten- und Informationsmanagement"
        }, {
            "attributes": {
                "gguid": "0xE49FAC9FCD7CDB40873A442DC21771FE",
                "name": "Multimedia-Technologie",
                "termname": "WS 2015/2016"
            },
            "group": "Master of Science (M.Sc.)",
            "fieldname": "Media Informatics (M.Sc.)",
            "path": "Multimedia-Technologie"
        }],
        "appointment": [{
            "attributes": {
                "gguid": "0x3D8396A7E19FC04E950674C7D36B66AF",
                "start": "2015-10-20T10:15:00",
                "end": "2015-10-20T11:45:00",
                "room": "2356|051"
            }, "notes": "Organization, Topic and project planning", "keyword": "Advanced Web Technologies (WebTech 2)"
        }],
        "periodical": [{
            "attributes": {"scheme": "7", "start": "2015-10-20T10:15:00", "end": "2016-02-09T11:45:00"},
            "gguid": "0x2861700E019CC3428502232F52390641",
            "appointment": [{
                "attributes": {
                    "gguid": "0x31D2527F3ED6094E9D6DB0C0DD663C38",
                    "start": "2015-12-22T10:15:00",
                    "end": "2015-12-22T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x76160A8E9BA5564F94E12865B513E474",
                    "start": "2015-11-17T10:15:00",
                    "end": "2015-11-17T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xB92F3D02B92CC346847BB90E3DB0F736",
                    "start": "2015-12-15T10:15:00",
                    "end": "2015-12-15T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xDBDEB4FD8F902D46B7D6FACD90E60384",
                    "start": "2016-02-02T10:15:00",
                    "end": "2016-02-02T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x2DB3480A0C30A742A0A357CD70CF44D4",
                    "start": "2015-10-27T10:15:00",
                    "end": "2015-10-27T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x5CA6F01AEEC461418E13BF6C76A23B0F",
                    "start": "2016-01-12T10:15:00",
                    "end": "2016-01-12T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x5B509CAC15E8DF4B95A89AA94FC552CF",
                    "start": "2015-11-10T10:15:00",
                    "end": "2015-11-10T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x24C92560BDA86C45AD022C875C81BA2B",
                    "start": "2016-01-19T10:15:00",
                    "end": "2016-01-19T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xA79DEC42EBE1B04EA7A5E1B933D9C4F0",
                    "start": "2016-02-09T10:15:00",
                    "end": "2016-02-09T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xA00D0BD1F3D9BD44B433069A50CF9938",
                    "start": "2015-12-08T10:15:00",
                    "end": "2015-12-08T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x271B21952337BD40AE79876423A605FC",
                    "start": "2015-12-01T10:15:00",
                    "end": "2015-12-01T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xCC16AB02C347484AB56576F958610700",
                    "start": "2015-11-24T10:15:00",
                    "end": "2015-11-24T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x04C623B639D2644F8D3BE2678722E60F",
                    "start": "2016-01-26T10:15:00",
                    "end": "2016-01-26T11:45:00",
                    "room": "2356|051"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }]
        }, {
            "attributes": {"scheme": "7", "start": "2015-10-21T18:15:00", "end": "2016-02-10T19:45:00"},
            "gguid": "0xF7E472C2B0F7CB48A8932F7636D8D284",
            "appointment": [{
                "attributes": {
                    "gguid": "0x40D3A59D84D9644FB6B083FF6F4237CA",
                    "start": "2016-01-13T18:15:00",
                    "end": "2016-01-13T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xF767E35C4DB95546B7DC89492110318E",
                    "start": "2016-01-06T18:15:00",
                    "end": "2016-01-06T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xD49FECD6ACBA6241B6BC3B960E631B6A",
                    "start": "2016-01-20T18:15:00",
                    "end": "2016-01-20T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x102D245590120C48AA2C52AA99005B70",
                    "start": "2015-11-04T18:15:00",
                    "end": "2015-11-04T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xC0A9D9F17821A440902CAE391B455E0D",
                    "start": "2015-12-16T18:15:00",
                    "end": "2015-12-16T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x53C5E475BEADE344A597ABEAF7841816",
                    "start": "2015-12-02T18:15:00",
                    "end": "2015-12-02T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xCCAAD187E958BC46BD9A3A11A5880597",
                    "start": "2015-10-28T18:15:00",
                    "end": "2015-10-28T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xB81491BA299E654DA4A7EF412B0D39BD",
                    "start": "2016-01-27T18:15:00",
                    "end": "2016-01-27T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x87D73740ADCF884582055FBFA9D219BA",
                    "start": "2015-12-09T18:15:00",
                    "end": "2015-12-09T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xFA0FCDB37C807146AD92647E6A4435B7",
                    "start": "2015-11-11T18:15:00",
                    "end": "2015-11-11T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x44C61C6B7F66A54D86630DCA49586D1D",
                    "start": "2015-11-25T18:15:00",
                    "end": "2015-11-25T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xEA93E24F60F8F2499CE12184E82232AA",
                    "start": "2016-02-03T18:15:00",
                    "end": "2016-02-03T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x42354AD4FD8E0142955BEF7F41C8B7A0",
                    "start": "2015-11-18T18:15:00",
                    "end": "2015-11-18T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0xDB75D26950681E4E9CC72A7F0D130745",
                    "start": "2016-02-10T18:15:00",
                    "end": "2016-02-10T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }, {
                "attributes": {
                    "gguid": "0x5CC3CE6C5185F84A856F461E6F2ADF28",
                    "start": "2015-10-21T18:15:00",
                    "end": "2015-10-21T19:45:00",
                    "room": "2350|009"
                }, "keyword": "Advanced Web Technologies (WebTech 2)"
            }]
        }],
        "unit": [{
            "attributes": {
                "gguid": "0x2144C8C10685D51196700000F4B4937D",
                "name": "Lehr- und Forschungsgebiet Informatik 9 (Lerntechnologien) ",
                "ikz": "122420",
                "alias": "Learning Technologies",
                "abbr": "i9"
            }, "link": "learntech.rwth-aachen.de"
        }],
        "test": "<p><strong>*** IMPORTANT: If you have taken the \"Web Technologies\" course&#160; in the previous semesters you can NOT take this one, because it is almost identical to the previous courses! ***</strong></p>\r\n<p>Die Pr&#252;fung des Moduls setzt sich aus drei Teilleistungen  zusammen: Einer Klausur oder m&#252;ndlichen Pr&#252;fung zum Nachweis der in der Vorlesung erarbeiteten  theoretischen Fundierung, einem Referat zur wissenschaftlichen Darstellung  eines aktuellen Themas der Vorlesung und  einer Projektarbeit f&#252;r die konkrete Anwendung der  erarbeiteten Technologien.</p>\r\n<p>Zum Bestehen der Pr&#252;fung ist das Bestehen der drei  Teilleistungen erforderlich.</p>\r\n<p>Die Gesamtnote ergibt sich zu 33% aus der Note der  Vorlesung, gepr&#252;ft &#252;ber eine m&#252;ndliche Pr&#252;fung oder schriftliche Klausur zum  Semesterende, zu 17% aus dem Referat, zugeh&#246;riger Ausarbeitung und &#220;bungsaufgabe und zu 50% aus der semesterbegleitenden Projektarbeit.</p>\r\n<p>&#160;</p>\r\n<p>&#160;---</p>\r\n<p>Getting credits for this course   requires a successful completion of all assignments, project, and oral   or written exam at the end of the semester. The final grade will be   calculated as follows: assignments and project (50%), student presentations including tutorial and exercise for peers (17%) and oral/written   exam (33%).&#160;</p>\r\n<br />\r\n<p>&#160;</p>\r\n<p>&#160;</p>",
        "prereq": "<strong>*** IMPORTANT: If you have taken the \"Web Technologies\" course&#160; in the previous semesters you can NOT take this one, because it is almost identical to the previous courses! ***<br /><br /></strong><strong>Due to didactic methods in this module participation is limited to 30 participants (first come first serve).</strong>",
        "follow": "There are various opportunities to follow up this course: The Master course \"Advanced Learning Technologies\",&#160; as well as specific seminars und practical/project labs on Web Technologies, Mobile Development, and eLearning.<br />",
        "note": "<strong>*** WICHTIG: Aufgrund der Neuorganisation der  Lehrveranstaltungen des i9, ist diese neue Web Tech 2 Verantaltung  praktisch identisch zur bisherigen Web Tech 1. Daher k&#246;nnen STudierende,  die in den vorherigen Semestern an der Web Tech teilgenommen haben,  diese Vorlesung NICHT belegen.&#160; ***<br /><br /></strong><strong>*** IMPORTANT: If you have taken the \"Web Technologies\" course&#160;  in the previous semesters you can NOT take this one, because it is  almost identical to the previous courses! ***</strong>",
        "info": [{
            "attributes": {"lang": "gb"},
            "title": "Advanced Web Technologies (WebTech 2)",
            "description": "<p><strong>*** IMPORTANT: If you have taken the \"Web Technologies\" course&#160; in the previous semesters you can NOT take this one, because it is almost identical to the previous courses! ***</strong></p>\r\n<p><strong></strong><strong></strong>The World Wide Web has a tremendous effect on the everyday life of  people. Within just a few years, we have learned to use the Web for  many different tasks, ranging from simple gathering of information to  processing complex workflows.  Thus the World Wide Web and its underlying technologies gain importance  for the development of interactive Web applications. Today, lots of  systems are developed in a mostly ad-hoc and unsystematic way, and the  systems' quality is not assured. Although known methods from software  engineering and for the design of information systems and distributed  systems exist, these do not carry over easily to the development of web  applications.</p>\r\n<p>The course focuses on the combination of different methods and web  technologies; these will generally not be discussed in great detail,  but instead exemplarily presented by student teams.  In other departments the underlying theories and technologies may be studied in  greater detail and with specific focuses (e.g. distributed systems,  data communication, software engineering, eCommerce systems,  information systems, hypermedia, human computer interaction, and  eLearning). In this course the methods and technologies are combined  and discussed in the context of web projects.</p>\r\n<p>Basic WWW technologies (HTML, HTTP, CSS, XML, JavaScript, Ajax, php, Java Servlets, JSP), which are introduced in \"Introduction to Web Technologies (WebTech 1)\" are a prerequisite to take this course. Advanced and emerging Web technologies will be presented in the lecture by the students.</p>\r\n<p>All participants will work on a project evolving with the course.</p>"
        }, {
            "attributes": {"lang": "de"},
            "title": "Advanced Web Technologies (WebTech 2)",
            "description": "<strong>*** WICHTIG: Aufgrund der Neuorganisation der Lehrveranstaltungen des i9, ist diese neue Web Tech 2 Verantaltung praktisch identisch zur bisherigen Web Tech 1. Daher k&#246;nnen STudierende, die in den vorherigen Semestern an der Web TEch teilgenommen haben, diese Vorlesung NICHT belegen.&#160; ***<br /><br /></strong>Das Internet hat einen gewaltigen Einfluss auf  unseren Alltag. Innerhalb weniger Jahre haben wir gelernt, mit Hilfe des  Internets verschiedenste Aufgaben zu bew&#228;ltigen, angefangen von der einfachen  Informationssuche bis hin zu komplexen Workflows. Somit gewinnen das World Wide  Web und die ihm zugrundeliegenden Technologien zunehmend an Bedeutung f&#252;r die  Entwicklung interaktiver Softwaresysteme. <br />\r\n<p><br /> Im Kern greift diese Lehrveranstaltung eine Menge verschiedener Konzepte, Prinzipien,  Methoden und Web-Technologien auf. Diese werden daher in der Vorlesung &#252;berblicksartig behandelt und exemplarisch  vorgestellt und im begleitenden Praktikum praktisch erprobt. Z.T. k&#246;nnen die  zugrundeliegenden Technologien aus spezifischen Blickrichtungen in anderen  Fachgebieten vertieft und theoretisch fundiert studiert werden (z.B. Verteilte  Systeme, Datenkommunikation, Software Engineering, eCommerce Systeme,  Informationssysteme, Hypermedia, Human-Computer Interaction und eLearning). In  diesem Modul werden die Methoden und Techniken zusammengef&#252;hrt und im Kontext  von (kleinen) Webprojekten besprochen. <br /><br /> Ziel des Moduls ist es, in die f&#252;r die Entwicklung von Web-Anwendungen  notwendigen Technologien und relevanten Themenbereiche einzuf&#252;hren und diese im  Zusammenhang und praktischer Erprobung kennen zu lernen. Die Basistechnologien des WWW&#160; (u.a. HTML, CSS, HTTP. XML, php, JavaScript, Ajax, Java Servlets und Java  Server Pages), wie sie in der Introduction to Web Technologies (WebTech 1 ) behandelt werden, werden in diesem Modul vporausgesetzt.. Die Vorlesung wird durch Expertenvortr&#228;ge der Studierenden gestaltet und von Projekten  im Praktikum mit konkreten Werkzeugen begleitet.</p>\r\n<ul>\r\n<li>Web Application  Development Frameworks</li>\r\n<li>Server-side technologies</li>\r\n<li>Client-side technologies: RIA</li>\r\n<li>Web Services: Web-APIs, REST, SOAP, Mash-Ups</li>\r\n<li>Mobile technologies</li>\r\n</ul>"
        }],
        "link": [{"attributes": {"type": "Homepage", "href": ""}}],
        "l2p": {"attributes": {"use": "true", "reset": "false", "lang": "1033"}}
    }
}


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

        describe('#parseCourseDetails()', function () {
            it('should return all the details for a specific course', function () {
                var details = parser.parseCourseDetails(COURSE_DETAILS);
                console.log(details);
                const DETAILS = {
                    "general": {
                        "gguid": "0x3D4824C6F312EA4DB691342B824CF9E7",
                        "ects": "6",
                        "language": "English",
                        "semester": "WS 2015/2016",
                        "type": "Vorlesung/Praktikum/Seminar (VPS)"
                    },
                    "contact": [{
                        "title": "Dr.-Ing.",
                        "surname": "Ulrik",
                        "name": "Schroeder",
                        "mail": ["schroeder@informatik.rwth-aachen.de"],
                        "phone": ["0151 14042553", "21930", "+49 241 80 21930", "+49 241 80 21931", "+49 241 80 621931"],
                        "address": {}
                    }, {
                        "surname": "Usman",
                        "name": "Wahid",
                        "mail": ["wahid@cil.rwth-aachen.de"],
                        "phone": ["+49 241 80 21952", "+49 241 80 621931"],
                        "address": {}
                    }, {
                        "surname": "Informatik",
                        "name": "Stundenplaner",
                        "mail": ["rossmanith@informatik.rwth-aachen.de"],
                        "phone": ["+49 241 80 21130"],
                        "address": {}
                    }, {
                        "surname": "Arham",
                        "name": "Muslim",
                        "mail": ["muslim@cil.rwth-aachen.de"],
                        "phone": ["+49 241 80 21952", "+49 241 80 621931"],
                        "address": {}
                    }, {
                        "name": "Raumvergabe",
                        "mail": ["raumvergabe@zhv.rwth-aachen.de"],
                        "phone": ["+49 241 80 94380"],
                        "address": {}
                    }, {
                        "title": "Dipl.-Inform.",
                        "surname": "Hendrik",
                        "name": "Thüs",
                        "mail": ["thues@cs.rwth-aachen.de"],
                        "phone": ["+49 241 80 21932", "+49 241 80 22930"],
                        "address": {}
                    }, {
                        "title": "Dr. rer. nat.",
                        "surname": "Mohamed Amine",
                        "name": "Chatti",
                        "mail": ["chatti@informatik.rwth-aachen.de"],
                        "phone": ["+49 241 80 21939", "+49 241 80 621931"],
                        "address": {}
                    }, {
                        "surname": "Vlatko",
                        "name": "Lukarov",
                        "mail": ["lukarov@cil.rwth-aachen.de"],
                        "phone": ["+49 241 80 21952", "+49 241 80 621931"],
                        "address": {}
                    }],
                    "events": [{
                        "appointments": [{
                            "start": "2015-12-22T10:15:00",
                            "end": "2015-12-22T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-11-17T10:15:00",
                            "end": "2015-11-17T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-12-15T10:15:00",
                            "end": "2015-12-15T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2016-02-02T10:15:00",
                            "end": "2016-02-02T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-10-27T10:15:00",
                            "end": "2015-10-27T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2016-01-12T10:15:00",
                            "end": "2016-01-12T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-11-10T10:15:00",
                            "end": "2015-11-10T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2016-01-19T10:15:00",
                            "end": "2016-01-19T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2016-02-09T10:15:00",
                            "end": "2016-02-09T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-12-08T10:15:00",
                            "end": "2015-12-08T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-12-01T10:15:00",
                            "end": "2015-12-01T11:45:00",
                            "room": "2356|051"
                        }, {
                            "start": "2015-11-24T10:15:00",
                            "end": "2015-11-24T11:45:00",
                            "room": "2356|051"
                        }, {"start": "2016-01-26T10:15:00", "end": "2016-01-26T11:45:00", "room": "2356|051"}]
                    }, {
                        "appointments": [{
                            "start": "2016-01-13T18:15:00",
                            "end": "2016-01-13T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2016-01-06T18:15:00",
                            "end": "2016-01-06T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2016-01-20T18:15:00",
                            "end": "2016-01-20T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-11-04T18:15:00",
                            "end": "2015-11-04T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-12-16T18:15:00",
                            "end": "2015-12-16T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-12-02T18:15:00",
                            "end": "2015-12-02T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-10-28T18:15:00",
                            "end": "2015-10-28T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2016-01-27T18:15:00",
                            "end": "2016-01-27T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-12-09T18:15:00",
                            "end": "2015-12-09T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-11-11T18:15:00",
                            "end": "2015-11-11T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-11-25T18:15:00",
                            "end": "2015-11-25T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2016-02-03T18:15:00",
                            "end": "2016-02-03T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2015-11-18T18:15:00",
                            "end": "2015-11-18T19:45:00",
                            "room": "2350|009"
                        }, {
                            "start": "2016-02-10T18:15:00",
                            "end": "2016-02-10T19:45:00",
                            "room": "2350|009"
                        }, {"start": "2015-10-21T18:15:00", "end": "2015-10-21T19:45:00", "room": "2350|009"}]
                    }]
                }
            })
        })
    }
)