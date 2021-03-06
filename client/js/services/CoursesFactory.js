app.factory('Courses', function ($q, $http, $log) {

    // convert the time into a string
    function convertTime(time) {
        time = new Date(time);

        var hours = time.getHours();
        var min = time.getMinutes();

        min == 0 ? min = '0' + min : min;

        var strTime = hours + ':' + min + 'h';

        return strTime;
    }

    // cached unscheduled
    var unscheduled = [];

    function putUnscheduled(course) {

        // delete event in unscheduled if it already exists
        unscheduled = unscheduled.filter(function (e) {
            return course.gguid != e.gguid;
        });

        // push course to unscheduled arr
        unscheduled.push(course);
    }

    function getCoursesWithoutDate(courses) {
        return courses.filter(function (course) {
            return !course.events[0];
        });
    }

    function getCoursesWithDate(courses) {
        return courses.filter(function (course) {
            return course.events[0];
        });
    }

    function sortCoursesByTime(courses) {
        return courses.sort(function (a, b) {
            var a = new Date(a.events[0].start);
            var b = new Date(b.events[0].start);

            a = a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();
            b = b.getHours() + ':' + b.getMinutes() + ':' + b.getSeconds();

            return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
        });
    }

    return {

        getUnscheduled: function () {
            return unscheduled;
        },

        resetUnscheduled: function () {
            unscheduled = [];
        },

        clearCache: function () {
            cachedCourses = [];
        },

        // get list of semesters from the server
        getSemesters: function () {
            return $http.get('/api/semesters').then(function (response) {
                return response.data;
            });
        },

        // get list of fields from the server
        getFields: function () {
            return $http.get('/api/fields').then(function (response) {
                return response.data;
            });
        },

        get: function (semester, field) {

            // get courses from server
            var semesterEncoded = window.encodeURIComponent(semester);
            var fieldEncoded = window.encodeURIComponent(field);

            return $http.get('/api/courses?semester=' + semesterEncoded + '&field=' + fieldEncoded).then(function (response) {
                return response.data;
            });
        },

        // get list of courses of specified IDs
        getByIDs: function (ids) {
            var defered = $q.defer();

            $http({
                method: 'get',
                url: '/api/courses?ids=' + ids
            }).success(function (res) {

                defered.resolve(res);
            });


            return defered.promise;
        },

        sort: function (courses) {

            var schedule = [
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null]
            ];

            var coursesWithDate = getCoursesWithDate(courses);
            var coursesWithoutDate = getCoursesWithoutDate(courses);

            courses = sortCoursesByTime(coursesWithDate).concat(coursesWithoutDate);

            for (var i = 0; i < courses.length; i++) {

                // test if an event exists
                if (!courses[i].events[0]) {
                    $log.warn(courses[i].name + ' has no events');
                    putUnscheduled(courses[i]);
                    continue;
                }

                for(var j=0; j<courses[i].events.length; j++){
                    
                    // test if a weekday exists
                    if (!courses[i].events[j].weekday) {
                        $log.warn(courses[i].name + ' has no weekday');
                        putUnscheduled(courses[i]);
                        continue;
                    }

                    switch (convertTime(courses[i].events[j].start)) {
                        case '8:00h':
                            if (schedule[0][courses[i].events[j].weekday - 1] == null) {
                                // push the first course
                                schedule[0][courses[i].events[j].weekday - 1] = [{
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                }]
                            } else if ((schedule[0][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[0][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put css marker on second event
                                (schedule[0][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '8:15h':
                            if (schedule[0][courses[i].events[j].weekday - 1] == null) {
                                // push the first course
                                schedule[0][courses[i].events[j].weekday - 1] = [{
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                }]
                            } else if ((schedule[0][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[0][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put css marker on second event
                                (schedule[0][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '8:30h':
                            if (schedule[0][courses[i].events[j].weekday - 1] == null) {
                                // push the first course
                                schedule[0][courses[i].events[j].weekday - 1] = [{
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {halfpast: true}
                                }]
                            } else if ((schedule[0][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[0][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {halfpast: true}
                                });
                                // put css marker on second event
                                (schedule[0][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '9:00h':
                            if (schedule[1][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[0][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[1][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[1][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[1][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put css marker on second event
                                (schedule[1][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '9:15h':
                            if (schedule[1][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[0][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[1][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[1][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[1][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put css marker on second event
                                (schedule[1][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '9:30h':
                            if (schedule[1][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[0][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[1][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {halfpast: true}
                                    }]
                                }
                            } else if ((schedule[1][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[1][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {halfpast: true}
                                });
                                // put css marker on second event
                                (schedule[1][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '10:00h':
                            if (schedule[2][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[1][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[2][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[2][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[2][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put css marker on second event
                                (schedule[2][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '10:15h':
                            if (schedule[2][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[1][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[2][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[2][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[2][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put css marker on second event
                                (schedule[2][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '10:30h':
                            if (schedule[2][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[1][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[2][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {halfpast: true}
                                    }]
                                }
                            } else if ((schedule[2][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[2][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {halfpast: true}
                                });
                                // put css marker on second event
                                (schedule[2][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '11:00h':
                            if (schedule[3][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[2][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[3][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[3][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[3][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put css marker on second event
                                (schedule[3][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '11:15h':
                            if (schedule[3][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[2][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[3][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[3][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[3][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put css marker on second event
                                (schedule[3][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '12:00h':
                            if (schedule[4][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[3][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[4][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[4][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[4][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put css marker on second event
                                (schedule[4][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '12:15h':
                            if (schedule[4][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[3][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[4][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[4][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[4][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put css marker on second event
                                (schedule[4][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '13:00h':
                            if (schedule[5][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[5][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[5][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[5][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[5][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put a css-marker on the second course
                                (schedule[5][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '13:15h':
                            if (schedule[5][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[5][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[5][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[5][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[5][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put a css-marker on the second course
                                (schedule[5][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '14:00h':
                            if (schedule[6][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[5][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[6][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[6][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[6][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put a css-marker on the second course
                                (schedule[6][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '14:15h':
                            if (schedule[6][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[5][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[6][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[6][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[6][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put a css-marker on the second course
                                (schedule[6][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '15:15h':
                            if (schedule[7][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[6][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    // push the first course
                                    schedule[7][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[7][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[7][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put a css-marker on the second course
                                (schedule[7][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '16:00h':
                            if (schedule[8][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[7][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[8][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[8][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[8][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put a css-marker on the second course
                                (schedule[8][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '16:15h':
                            if (schedule[8][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[7][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[8][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[8][courses[i].events[j].weekday - 1]).length < 2) {
                                // push the second course
                                schedule[8][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put a css-marker on the second course
                                (schedule[8][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '17:00h':
                            if (schedule[9][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[8][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[9][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[9][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[9][courses[i].events[j].weekday - 1].push({
                                    // push the second course
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });
                                // put a css-marker on the second course
                                (schedule[9][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '17:15h':
                            if (schedule[9][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[8][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[9][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[9][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[9][courses[i].events[j].weekday - 1].push({
                                    // push the second course
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });
                                // put a css-marker on the second course
                                (schedule[9][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '18:00h':
                            if (schedule[10][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[9][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[10][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[10][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[10][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });

                                (schedule[10][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '18:15h':
                            if (schedule[10][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[9][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[10][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[10][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[10][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });

                                (schedule[10][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '19:00h':
                            if (schedule[11][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[10][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[11][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[11][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[11][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });

                                (schedule[11][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '19:15h':
                            if (schedule[11][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[10][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[11][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[11][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[11][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });

                                (schedule[11][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '20:00h':
                            if (schedule[12][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[11][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[12][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid
                                    }]
                                }
                            } else if ((schedule[12][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[12][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid
                                });

                                (schedule[12][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        case '20:15h':
                            if (schedule[12][courses[i].events[j].weekday - 1] == null) {
                                // check for any conflict a hour before
                                if (schedule[11][courses[i].events[j].weekday - 1] != null) {
                                    putUnscheduled(courses[i]);
                                } else {
                                    schedule[12][courses[i].events[j].weekday - 1] = [{
                                        name: courses[i].name,
                                        gguid: courses[i].gguid,
                                        offset: {quarterpast: true}
                                    }]
                                }
                            } else if ((schedule[12][courses[i].events[j].weekday - 1]).length < 2) {
                                schedule[12][courses[i].events[j].weekday - 1].push({
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                });

                                (schedule[12][courses[i].events[j].weekday - 1])[1].css = true;
                            } else {
                                // if there already exist 2 entries for a specific time
                                putUnscheduled(courses[i]);
                            }
                            break;
                        default:
                            // save these without specific time
                            putUnscheduled(courses[i]);
                    }
                }
            }

            return schedule;
        },

        getTimes: function () {
            return ['8:00h', '9:00h', '10:00h', '11:00h', '12:00h', '13:00h', '14:00h', '15:00h', '16:00h', '17:00h', '18:00h', '19:00h', '20:00h', '21:00h'];
        }
    }
});