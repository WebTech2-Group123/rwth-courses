/*
 * Module that contains all function to parse
 * the CampusOffice APIs' reponses.
 */

'use strict';
const utils = require('./utils');
const log = require('debug')('parser');

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
                semester: field['termname']
            }
        });
}

/**
 * Parse a SubField of Studies response in an Array of SubField of Studies.
 */
function parseSubFields(result) {
    return utils.map(result, 'field', 'subfield', el => {
            var subfield = el['attributes'];
            return {
                gguid: subfield['gguid'],
                name: subfield['name']
            }
        }) || [];
}

/**
 * Parse a list of Courses response in an Array of GGUIDs.
 */
function parseCoursesList(result) {
    return utils.map(result, 'field', 'event', course => course['attributes']['gguid']) || [];
}

/**
 * Parse a Course response in a clean Course object.
 */
function parseCourseDetails(result) {
    var event = result['event'];

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
        contact: event['address'].map(contact => {
            return {
                surname: contact['christianname'],
                name: contact['name'],
                mail: contact['mail'][0]['attributes']['mail'],
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
        }).filter(contact => contact.name !== 'Stundenplaner'),

        // seminars do not have this field!
        events: event['periodical'].map(el => {
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