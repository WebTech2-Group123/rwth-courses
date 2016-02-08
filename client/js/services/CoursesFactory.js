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

    // cache courses
    var cachedCourses = [];

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

    return {

        getUnscheduled: function () {
            return unscheduled;
        },

        deleteUnscheduled: function (gguid, all) {

            // delete the whole arr
            if (all) {
                unscheduled = [];
                return;
            }

            unscheduled = unscheduled.filter(function (course) {
                return gguid != course.gguid;
            });
        },

        clearCache: function () {
            cachedCourses = [];
        },

        get: function (semester, field) {

            var defered = $q.defer();

            console.log(cachedCourses.length);

            // check if courses are cached
            if (cachedCourses.length > 0) {
                console.log('courses from cache...');
                defered.resolve(cachedCourses);
            }

            else {
                // get courses from server
                var semester = window.encodeURIComponent(semester);
                var field = window.encodeURIComponent(field);

                console.log(semester + ' >> ' + field);

                $http({
                    method: 'get',
                    url: '/api/courses?semester=' + semester + '&field=' + field
                }).success(function (res) {
                    cachedCourses = res;
                    //console.log(courses);
                    console.log(cachedCourses.length);
                    defered.resolve(res);
                }).error(function (res) {
                    console.log(res);
                });
            }

            return defered.promise;
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
                [null, null, null, null, null, null]
            ];

            for (var i = 0; i < courses.length; i++) {
                if (!courses[i].events[0]) {
                    $log.warn(courses[i].name + ' has no events');
                    putUnscheduled(courses[i]);
                    continue;
                }

                if (!courses[i].events[0].weekday) {
                    $log.warn(courses[i].name + ' has no weekday');
                    putUnscheduled(courses[i]);
                    continue;
                }

                switch (convertTime(courses[i].events[0].start)) {
                    case '8:30h':
                        if (schedule[0][courses[i].events[0].weekday - 1] == null) {
                            schedule[0][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else if ((schedule[0][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[0][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });

                            (schedule[0][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '9:30h':
                        if (schedule[1][courses[i].events[0].weekday - 1] == null) {
                            schedule[1][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else if ((schedule[1][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[1][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });

                            (schedule[1][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '10:00h':
                        if (schedule[2][courses[i].events[0].weekday - 1] == null) {
                            schedule[2][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            }]
                        } else if ((schedule[2][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[2][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            });

                            (schedule[2][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '10:15h':
                        if (schedule[2][courses[i].events[0].weekday - 1] == null) {
                            schedule[2][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[2][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[2][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[2][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '10:30h':
                        if (schedule[2][courses[i].events[0].weekday - 1] == null) {
                            schedule[2][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else if ((schedule[2][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[2][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });

                            (schedule[2][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '11:15h':
                        if (schedule[3][courses[i].events[0].weekday - 1] == null) {
                            schedule[3][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[3][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[3][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            // put css marker on second event
                            (schedule[3][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '12:00h':
                        if (schedule[4][courses[i].events[0].weekday - 1] == null) {
                            schedule[4][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            }]
                        } else if ((schedule[4][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[4][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            });

                            // put css marker on second event
                            (schedule[4][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '12:15h':
                        if (schedule[4][courses[i].events[0].weekday - 1] == null) {
                            schedule[4][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[4][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[4][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            // put css marker on second event
                            (schedule[4][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '13:15h':
                        if (schedule[5][courses[i].events[0].weekday - 1] == null) {
                            schedule[5][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[5][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[5][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[5][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '14:15h':
                        if (schedule[6][courses[i].events[0].weekday - 1] == null) {
                            schedule[6][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[6][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[6][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[6][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '15:15h':
                        if (schedule[7][courses[i].events[0].weekday - 1] == null) {
                            // check for any conflict a hour before
                            if (schedule[6][courses[i].events[0].weekday - 1] != null) {
                                putUnscheduled(courses[i]);
                            } else {
                                // push the first course
                                schedule[7][courses[i].events[0].weekday - 1] = [{
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                }]
                            }
                        } else if ((schedule[7][courses[i].events[0].weekday - 1]).length < 2) {
                            // push the second course
                            schedule[7][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });
                            // put a css-marker on the second course
                            (schedule[7][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '16:15h':
                        if (schedule[8][courses[i].events[0].weekday - 1] == null) {
                            // check for any conflict a hour before
                            if (schedule[7][courses[i].events[0].weekday - 1] != null) {
                                putUnscheduled(courses[i]);
                            } else {
                                schedule[8][courses[i].events[0].weekday - 1] = [{
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                }]
                            }
                        } else if ((schedule[8][courses[i].events[0].weekday - 1]).length < 2) {
                            // push the second course
                            schedule[8][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });
                            // put a css-marker on the second course
                            (schedule[8][courses[i].events[0].weekday - 1])[1].css = true;
                        } else {
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '17:15h':
                        if (schedule[9][courses[i].events[0].weekday - 1] == null) {
                            // check for any conflict a hour before
                            if (schedule[8][courses[i].events[0].weekday - 1] != null) {
                                putUnscheduled(courses[i]);
                            } else {
                                schedule[9][courses[i].events[0].weekday - 1] = [{
                                    name: courses[i].name,
                                    gguid: courses[i].gguid,
                                    offset: {quarterpast: true}
                                }]
                            }
                        } else if ((schedule[9][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[9][courses[i].events[0].weekday - 1].push({
                                // push the second course
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });
                            // put a css-marker on the second course
                            (schedule[9][courses[i].events[0].weekday - 1])[1].css = true;
                        } else{
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '18:15h':
                        if (schedule[10][courses[i].events[0].weekday - 1] == null) {
                            schedule[10][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[10][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[10][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[10][courses[i].events[0].weekday - 1])[1].css = true;
                        } else{
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '19:15h':
                        if (schedule[11][courses[i].events[0].weekday - 1] == null) {
                            schedule[11][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[11][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[11][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[11][courses[i].events[0].weekday - 1])[1].css = true;
                        } else{
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    case '20:15h':
                        if (schedule[12][courses[i].events[0].weekday - 1] == null) {
                            schedule[12][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[12][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[12][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[12][courses[i].events[0].weekday - 1])[1].css = true;
                        } else{
                            // if there already exist 2 entries for a specific time
                            putUnscheduled(courses[i]);
                        }
                        break;
                    default:
                        // save these without specific time
                        putUnscheduled(courses[i]);
                }
            }

            return schedule;
        },

        getTimes: function () {
            return ['8:00h', '9:00h', '10:00h', '11:00h', '12:00h', '13:00h', '14:00h', '15:00h', '16:00h', '17:00h', '18:00h', '19:00h', '20:00h'];
        }
    }
});