'use strict';

/*
 * Module that contains all function to parse
 * the CampusOffice APIs' responses.
 */

const striptags = require('striptags');
const utils = require('./utils');

/**
 * Parse a Semesters response in an Array of semesters.
 */
function parseSemesters(result) {
    return result['GetAllResult']['Term']
        .filter((value, index) => index <= 1)        // .filter -> take only 2 elements of the array
        .map(el => {
            var semester = el['attributes'];
            return {
                gguid: semester['gguid'],
                name: semester['name'],
                start: new Date(semester['start'])
            }
        });
}

/**
 * Parse a Fields of Studies response in an Array of Fields of Studies.
 */
function parseFieldOfStudies(result) {
    return result['GetFieldsResult']['Field']
        .map(el => {
            var field = el['attributes'];
            return {
                gguid: field['gguid'],
                name: field['name'],
                semester: field['termname'],
                group: el['group']
            }
        });
}

/**
 * Recursively parse the subfields in the tree.
 */
function getSubfields(subfield) {
    if (typeof subfield === 'undefined') {
        return [];
    } else {
        var accumulator = [];

        subfield.forEach(element => {

            // add current subfield
            var current = {
                gguid: element['attributes']['gguid'],
                name: element['attributes']['name'],
                semester: element['attributes']['termname'],
                path: element['path']
            };
            accumulator.push(current);

            // get sub-sub-fields recursive
            var subsubfields = getSubfields(element['subfield']);
            accumulator = accumulator.concat(subsubfields);
        });

        return accumulator;
    }
}

/**
 * Parse a SubField of Studies response in an Array of SubField of Studies.
 * NB: ignore courses without subfield (see worker.js)
 */
function parseSubFields(result) {
    var subfields = getSubfields(result['field']['subfield']);
    var fieldAttributes = result['field']['attributes'];
    var field = {
        gguid: fieldAttributes['gguid'],
        name: fieldAttributes['name'],
        semester: fieldAttributes['termname'],
        path: ""
    };
    subfields.unshift(field);
    return subfields;
}

/**
 * Parse a list of Courses response in an Array of courses
 * (with only gguid and a couple of other attributes).
 */
function parseCoursesList(result) {
    var courses = utils.map(result, 'field', 'event', course => {
            return {
                gguid: course['attributes']['gguid'],
                name: course['info'][0]['title'],
                type: course['attributes']['type']
            }
        }) || [];

    // remove exams
    return courses.filter(course => {
        return course.type !== 'Klausur (Kl)' &&
            course.type !== 'Mündliche Prüfung (MP)' &&
            course.type !== 'Fragestunde (F)';
    });
}

/**
 * Utility function to match at least one element of an array of strings against one string.
 */
function contains(string, array) {
    return array.reduce((accumulator, current) => {
        return accumulator || string.indexOf(current) >= 0;
    }, false);
}

/**
 * Parse the language field.
 */
function parseLanguage(language) {

    // if language not existing -> return 'UNKNOWN'
    if (typeof language === 'undefined') {
        return ['UNKNOWN'];
    }

    // init a empty array for the found languages
    var parsed = [];

    // check german
    if (contains(language.toLowerCase(), ['deutsch', 'german'])) {
        parsed.push('DE');
    }

    // check english
    if (contains(language.toLowerCase(), ['english', 'englisch'])) {
        parsed.push('EN');
    }

    // if nothing, return "OTHER"
    if (parsed.length === 0) {
        parsed.push('OTHER');
    }

    return parsed;
}

function parseECTS(ects) {

    // default value
    const def = [0];

    // some courses simply do not have a credit points numbers... return 0
    if (typeof ects === 'undefined') {
        return def;
    }

    // replace , with . (to identify numbers with comma, yes also this is present in Campus)
    var ectsPoint = ects.replace(/,/g, '.');

    // extract numbers
    var matches = ectsPoint.match(/\d+\.?(\d+)?(\s|$)/g);

    // transform in numbers
    return matches ? matches.map(s => parseInt(s, 10)) : def;
}

function parseType(type) {

    // some courses simply do not have a credit points numbers... return 0
    if (typeof type === 'undefined') {
        return ['No Type'];
    }

    //Übung (Ü),
    //Vorlesung (V),
    //Tutorium (Tut),
    //Proseminar (PS),
    //Vorlesung/Übung/Praktikum (VÜP),
    //Praktikum (P),
    //Vorlesung/Praktikum (VP),
    //Seminar (S),
    //Vorlesung/Übung (VÜ),
    //Arbeitsgemeinschaft (AG),
    //Hauptseminar (HS),
    //Fragestunde (F),
    //Sprachkurs (SK),
    //Laborübungen (LÜ),
    //Vorlesung/Praktikum/Seminar (VPS),
    //Übung/Praktikum (ÜP),
    //Hausarbeit (H),
    //Kolloquium (K),
    //Programmierübungen (PÜ),
    //Forschungskolloquium (FK),
    //Präsentation (Prä),
    //Vorlesung/Kolloquium (VK),
    //Exkursion (E),
    //Doktorandenkolloquium (DoK),
    //Benotetes Protokoll (BP),
    //Examenskolloquium (EK),
    //Proseminar I (PS I),
    //Proseminar II (PS II),
    //Proseminar III (PS III),
    //Oberseminar (OS),
    //Intensivkurs (I)


    // mapping
    const MAPPING = Object.freeze({
        "Vorlesung": "Lecture",
        "Übung": "Exercise",
        "Praktikum": "Internship",
        "Tutorium": "Tutorium",
        "Seminar": "Seminar",
        "Arbeitsgemeinschaft": "Group Project",
        "Hauptseminar": "Seminar",
        "Sprachkurs": "Language Course",
        "Laborübungen": "Exercise",
        "Kolloquium": "Kolloquium",
        "Hausarbeit": "Seminar Paper",
        "Programmierübungen": "Exercise",
        "Forschungskolloquium": "Kolloquium",
        "Präsentation": "Presentation",
        "Exkursion": "Excursion",
        "Doktorandenkolloquium": "Kolloquium",
        "Examenskolloquium": "Kolloquium",
        "Proseminar": "Seminar",
        "Proseminar I": "Seminar",
        "Proseminar II": "Seminar",
        "Proseminar III": "Seminar",
        "Oberseminar": "Seminar",
        "Intensivkurs": "Crash Course",
        "Benotetes Protokoll": "Graded Protocol"
    });

    // remove abbreviations
    var typeWithoutAbbreviations = type.split(' (')[0];

    // split types
    var types = typeWithoutAbbreviations.split('/');

    // return new types
    return types.map(type => {
        return MAPPING[type];
    });
}

function parseInfo(info) {
    var response = {};

    // parse languages
    info.forEach(el => {
        switch (el['attributes']['lang']) {
            case 'gb':
                response.name = el['title'] ? striptags(el['title']) : undefined;
                response.description = el['description'] ? striptags(el['description']) : undefined;
                break;
            case 'de':
                response.name_de = el['title'] ? striptags(el['title']) : undefined;
                response.description_de = el['description'] ? striptags(el['description']) : undefined;
                break;
        }
    });

    // check if only one description... then copy the other language
    if (typeof response.name === 'undefined' && typeof response.name_de !== 'undefined') {
        response.name = response.name_de;
    }
    if (typeof response.name_de === 'undefined' && typeof response.name !== 'undefined') {
        response.name_de = response.name;
    }
    if (typeof response.description === 'undefined' && typeof response.description_de !== 'undefined') {
        response.description = response.description_de;
    }
    if (typeof response.name_de === 'undefined' && typeof response.description_de !== 'undefined') {
        response.name_de = response.description_de;
    }

    // substitute undefined with ""
    if (typeof response.name === 'undefined') {
        response.name = "";
    }
    if (typeof response.description === 'undefined') {
        response.description = "";
    }
    if (typeof response.name_de === 'undefined') {
        response.name_de = "";
    }
    if (typeof response.description_de === 'undefined') {
        response.description_de = "";
    }

    return response;
}

function parseInstitute(institute) {
    const TO_REMOVE = [
        'Abteilung 1.2 - ',
        'Abteilung 1.3 - ',
        'CAMPUS-Testgruppe',
        'Fachgruppe für ',
        'Fachgruppe ',
        'Fakultät für ',
        'Lehrstuhl und Institut für ',
        'Institut für ',
        'Juniorprofessur für ',
        'Lehr- und Forschungsgebiet ',
        'Lehrstuhl A für ',
        'Lehrstuhl B für ',
        'Lehrstuhl D für ',
        'Lehrstuhl I für ',
        'Lehrstuhl II für ',
        'Lehrstuhl für ',
        'Lehrstuhl ',
        'Profilbereich ',
        'Zentrale Einrichtungen der  ',
        'Zentrale Einrichtungen der ',
        'Zentrum für '
    ];
    return TO_REMOVE.reduce((acc, el) => acc && acc.replace(el, ''), institute).trim();
}

/**
 * Parse a Course response in a clean Course object.
 */
function parseCourseDetails(result) {
    var event = result['event'];
    var info = parseInfo(event['info']);

    return {
        gguid: event['attributes']['gguid'],

        // name & description
        name: info.name,
        description: info.description,
        name_de: info.name_de,
        description_de: info.description_de,

        // important info
        ects: parseECTS(event['attributes']['ects']),
        language: parseLanguage(event['attributes']['language']),
        semester: event['attributes']['termname'].replace('/', '-'),
        type: parseType(event['attributes']['type']),

        // other details
        details: {
            test: striptags(event['test']),
            prereq: striptags(event['prereq']),
            follow: striptags(event['follow']),
            note: striptags(event['note'])
        },

        // seminars do not have this field!
        events: utils.map(event, 'periodical', el => {
            var appointment = el['appointment'][0]['attributes'];
            return {
                weekday: new Date(appointment['start']).getDay(),
                start: new Date(appointment['start']).getTime(),
                end: new Date(appointment['end']).getTime(),
                room: appointment['room']
            }
        }),

        // units
        units: utils.map(event, 'unit', el => parseInstitute(el['attributes']['name'])) || [],

        // other info
        contact: (utils.map(event, 'address', contact => {
            return {
                name: contact['christianname'] + ' ' + contact['name'],
                mail: utils.get(contact, 'mail') && contact['mail'][0]['attributes']['mail'],
                address: {
                    department: utils.get(contact, 'work', 'company2'),
                    street: utils.get(contact, 'work', 'street'),
                    town: utils.get(contact, 'work', 'town'),
                    zip: utils.get(contact, 'work', 'zip'),
                    building: utils.get(contact, 'work', 'attributes', 'building'),
                    room: utils.get(contact, 'work', 'attributes', 'office')
                }
            }
        }) || []).filter(contact => !contains(contact.name, ['Stundenplaner', 'Raumvergabe', 'Prüfungsamt ZPA', 'Fachgruppe']))
    }
}

// expose functions
exports.parseSemesters = parseSemesters;
exports.parseFieldOfStudies = parseFieldOfStudies;
exports.parseSubFields = parseSubFields;
exports.parseCoursesList = parseCoursesList;
exports.parseCourseDetails = parseCourseDetails;

// utils
exports.parseLanguage = parseLanguage;
exports.parseECTS = parseECTS;
exports.parseType = parseType;
exports.parseInfo = parseInfo;
exports.parseInstitute = parseInstitute;