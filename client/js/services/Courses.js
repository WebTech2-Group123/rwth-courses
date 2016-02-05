app.factory('Courses', function ($q, $http, $log, localStorageService) {

    //function mapByGGUID(courses) {
    //    return courses.reduce(function (accumulator, course) {
    //        var gguid = course.gguid;
    //        accumulator[gguid] = course;
    //        return accumulator;
    //    }, {});
    //}
    //
    //// courses is a cache of courses
    //function coursesByIDS(coursesCache, ids) {
    //    var indexedByID = mapByGGUID(coursesCache);
    //    return ids.map(function (id) {
    //        return indexedByID[id];
    //    });
    //}

    // convert the time into a string
    function convertTime(time) {
        time = new Date(time);

        var hours = time.getHours();
        var min = time.getMinutes();

        min == 0 ? min = '0' + min : min;

        var strTime = hours + ':' + min + 'h';

        console.log('Time: ' + strTime);
        return strTime;
    }

    // cache courses
    var cachedCourses = [];

    return {

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
                // define query for the request to get the right courses
                //var query = {"semester": semester, "field": field};
                //query = JSON.stringify(query);
                //console.log(query);

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

        // TODO: create cache

        // get list of courses of specified IDs
        getByIDs: function (ids) {
            var defered = $q.defer();

            //var coursesList = localStorageService.get('courses');

            // api call to get courses by id

            // convert array of ids into string
            //var ids = ids.join();
            console.log('IDs string: ' + ids);

            $http({
                method: 'get',
                url: '/api/courses?ids=' + ids
            }).success(function (res) {

                defered.resolve(res);

                //// get courses from cache
                //var cachedCourses = coursesByIDS(res, ids);
                //
                //// check if all courses were found
                //var allFound = cachedCourses.indexOf(undefined) == -1;
                //
                //// if all found -> return them
                //if (allFound) {
                //    defered.resolve(cachedCourses);
                //}
                //
                //// else -> request to the server
                //else {
                //    // TODO
                //    alert('Cache miss -> TODO');
                //    defered.reject('Cache miss, TODO -> call server');
                //}
            })


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
                    break;
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
                        }
                        break;
                    case '9:30h':
                        if (schedule[1][courses[i].events[0].weekday - 1] == null) {
                            schedule[1][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else if ((schedule[0][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[1][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });

                            (schedule[0][courses[i].events[0].weekday - 1])[1].css = true;
                        }
                        break;
                    case '10:00h':
                        if (schedule[2][courses[i].events[0].weekday - 1] == null) {
                            schedule[2][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            }]
                        } else if ((schedule[0][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[2][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            });

                            (schedule[0][courses[i].events[0].weekday - 1])[1].css = true;
                        }
                        break;
                    case '10:30h':
                        if (schedule[2][courses[i].events[0].weekday - 1] == null) {
                            schedule[2][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else if ((schedule[0][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[2][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });

                            (schedule[0][courses[i].events[0].weekday - 1])[1].css = true;
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
                        }
                        break;
                    case '15:15h':
                        if (schedule[7][courses[i].events[0].weekday - 1] == null) {
                            schedule[7][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[7][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[7][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[7][courses[i].events[0].weekday - 1])[1].css = true;
                        }
                        break;
                    case '16:15h':
                        if (schedule[8][courses[i].events[0].weekday - 1] == null) {
                            schedule[8][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[8][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[8][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[8][courses[i].events[0].weekday - 1])[1].css = true;
                        }
                        break;
                    case '17:15h':
                        if (schedule[9][courses[i].events[0].weekday - 1] == null) {
                            schedule[9][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else if ((schedule[9][courses[i].events[0].weekday - 1]).length < 2) {
                            schedule[9][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });

                            (schedule[9][courses[i].events[0].weekday - 1])[1].css = true;
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
                        }
                        break;
                }
            }

            return schedule;
        },

        getTimes: function () {
            return ['8:00h', '9:00h', '10:00h', '11:00h', '12:00h', '13:00h', '14:00h', '15:00h', '16:00h', '17:00h', '18:00h', '19:00h', '20:00h'];
        }
    }
});