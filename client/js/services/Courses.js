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
    function convertTime(time){
        time = new Date(time);

        var hours = time.getHours();
        var min = time.getMinutes();
        var strTime = hours + ':' + min + 'h';

        console.log('Time: ' + strTime);
        return strTime;
    }

    return {
        get: function(semester, field){

            var defered = $q.defer();

            // define query for the request to get the right courses
            var query = {"semester" : semester, "field": field};

            // get courses from server
            $http({
                method: 'get',
                url: '/api/courses?query=' + query
            }).success(function(res){
                defered.resolve(res);
            }).error(function(res){
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
            }).success(function(res){
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
                [null, null, null, null, null, null]
            ];

            for (var i = 0; i < courses.length; i++) {
                switch (convertTime(courses[i].events[0].start)) {
                    case '8:30h':
                        schedule[0][courses[i].events[0].weekday - 1] == null ? schedule[0][courses[i].events[0].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[0][courses[i].events[0].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                    case '10:30h':
                        schedule[1][courses[i].events[0].weekday - 1] == null ? schedule[1][courses[i].events[0].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[1][courses[i].events[0].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                    case '12:15h':
                        schedule[2][courses[i].events[0].weekday - 1] == null ? schedule[2][courses[i].events[0].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[2][courses[i].events[0].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                    case '18:15h':
                        schedule[3][courses[i].events[0].weekday - 1] == null ? schedule[3][courses[i].events[0].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[3][courses[i].events[0].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                }
            }

            return schedule;
        },

        getTimes: function () {
            return ['8:30h', '10:30h', '12:15h', '18:15h'];
        }
    }
});