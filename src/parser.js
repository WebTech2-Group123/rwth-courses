// functions to parse CampusOffice APIs reponses

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

exports.parseSemesters = parseSemesters;