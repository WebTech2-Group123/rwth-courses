app.factory('Courses', function ($q, $http, localStorageService) {

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
        var strTime = hours + ':' + min + 'h';

        console.log('Time: ' + strTime);
        return strTime;
    }

    return {
        get: function (semester, field) {

            var defered = $q.defer();

            // define query for the request to get the right courses
            var query = {"semester": semester, "field": field};

            // get courses from server
            $http({
                method: 'get',
                url: '/api/courses?query=' + query
            }).success(function (res) {
                defered.resolve(res);
            }).error(function (res) {
                console.log(res);
            });

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
                console.log(res);

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
                switch (convertTime(courses[i].events[0].start)) {
                    case '8:30h':
                        if (schedule[0][courses[i].events[0].weekday - 1] == null) {
                            schedule[0][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else {
                            schedule[0][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });
                        }
                        break;
                    case '10:30h':
                        if (schedule[2][courses[i].events[0].weekday - 1] == null) {
                            schedule[2][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            }]
                        } else {
                            schedule[2][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {halfpast: true}
                            });
                        }
                        break;
                    case '12:15h':
                        if (schedule[4][courses[i].events[0].weekday - 1] == null) {
                            schedule[4][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            }]
                        } else {
                            schedule[4][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid,
                                offset: {quarterpast: true}
                            });
                        }
                        break;
                    case '13:15h':
                        if (schedule[5][courses[i].events[0].weekday - 1] == null) {
                            schedule[5][courses[i].events[0].weekday - 1] = [{
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            }]
                        } else {
                            schedule[5][courses[i].events[0].weekday - 1].push({
                                name: courses[i].name,
                                gguid: courses[i].gguid
                            });
                        }
                        break;
                }
            }

            return schedule;
        },

        getTimes: function () {
            return ['8:00h', '9:00h', '10:00h', '11:00h', '12:00h', '13:00h'];
        }
    }
});