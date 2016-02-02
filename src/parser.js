'use strict';

/*
 * Module that contains all function to parse
 * the CampusOffice APIs' responses.
 */

const utils = require('./utils');
const log = require('debug')('rwth-courses:parser');

/**
 * Parse a Semesters response in an Array of semesters.
 */
function parseSemesters(result) {
    log('Parsing semesters list');

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
        return course.type !== 'Klausur (Kl)';
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

/**
 * Parse a Course response in a clean Course object.
 */
function parseCourseDetails(result) {
    var event = result['event'];

    // TODO!
    // NB: some courses miss contact
    // NB: some courses miss contact.email

    return {
        gguid: event['attributes']['gguid'],
        name: event['info'][0]['title'],
        ects: event['attributes']['ects'],
        language: event['attributes']['language'],
        semester: event['attributes']['termname'],
        type: event['attributes']['type'],
        details: {
            description: event['info'][0]['description'],
            test: event['test'],
            prereq: event['prereq'],
            follow: event['follow'],
            note: event['note']
        },
        contact: (utils.map(event, 'address', contact => {
            return {
                surname: contact['christianname'],
                name: contact['name'],
                mail: utils.get(contact, 'mail') && contact['mail'][0]['attributes']['mail'],
                address: {
                    department: utils.get(contact, 'work', 'company2'),
                    street: utils.get(contact, 'work', 'street'),
                    town: utils.get(contact, 'work', 'town'),
                    zip: utils.get(contact, 'work', 'zip'),
                    building: utils.get(contact, 'work', 'attributes', 'building'),
                    room: utils.get(contact, 'work', 'attributes', 'office')
                },
                consultationhour: utils.get(contact, 'consultationhour'),
                website: utils.map(contact, 'www', website => website['attributes']['href'])
            }
        }) || []).filter(contact => contact.name !== 'Stundenplaner'),

        // seminars do not have this field!
        events: utils.map(event, 'periodical', el => {
            var appointment = el['appointment'][0]['attributes'];
            return {
                gguid: el['gguid'],
                weekday: new Date(appointment['start']).getDay(),
                start: new Date(appointment['start']).getTime(),
                end: new Date(appointment['end']).getTime(),
                room: appointment['room']
            }
        })
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