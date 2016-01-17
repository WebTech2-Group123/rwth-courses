// functions to parse CampusOffice APIs reponses

var utils = require('./utils');

function parseSemesters(result) {

    // .filter -> take only 2 elements of the array

    return result['GetAllResult']['Term']
        .filter((value, index) => index <= 1)
        .map(el => {
            var semester = el['attributes'];
            return {
                gguid: semester['gguid'],
                start: new Date(semester['start']),
                name: semester['name']
            }
        });
}

function parseFieldOfStudies(result) {

    return result['GetFieldsResult']['Field']
        .map(el => {
            var field = el['attributes'];
            return {
                gguid: field['gguid'],
                semester: field['termname'],
                name: field['name']
            }
        });
}

function parseSubFields(result) {

    return result['field']['subfield']
        .map(el => {
            var subfield = el['attributes'];
            return {
                gguid: subfield['gguid'],
                name: subfield['name']
            }
        })
}

function parseCoursesList(result) {
    return result['field']['event']
        .map(course => course['attributes']['gguid']);
}

function parseCourseDetails(result) {
    var event = result['event'];

    return {
        gguid: event['attributes']['gguid'],
        general: {
            ects: event['attributes']['ects'],
            language: event['attributes']['language'],
            semester: event['attributes']['termname'],
            type: event['attributes']['type']
        },
        contact: event['address']
            .map(contact => {
                return {
                    title: contact['titlefront'],
                    surname: contact['christianname'],
                    name: contact['name'],
                    mail: contact['mail']
                        .map(mail => mail['attributes']['mail']),
                    phone: contact['phone']
                        .map(phone => phone['attributes']['number']),
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
            }),
        events: event['periodical']
            .map(el => {
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


exports.parseSemesters = parseSemesters;
exports.parseFieldOfStudies = parseFieldOfStudies;
exports.parseSubFields = parseSubFields;
exports.parseCoursesList = parseCoursesList;
exports.parseCourseDetails = parseCourseDetails;