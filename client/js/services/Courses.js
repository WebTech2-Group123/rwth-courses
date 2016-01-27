app.factory('Courses', function ($q) {

    // TODO: remove, developent only
    var coursesList = [
        {
            name: 'Advanced Internet Technology',
            lecturer: 'Dr. Thissen',
            institute: 'Informatik 4 (Kommunikation und verteilte Systeme)',
            subsection: 'Praktische Informatik',
            creditpoints: 3,
            gguid: 1,
            weekday: 2,
            time: '8:30h'
        },
        {
            name: 'Advanced Web Technologies (WebTech 2)',
            lecturer: 'Prof. Schröder',
            institute: 'Informatik 9 (Lerntechnologien)',
            subsection: 'Praktische Informatik',
            creditpoints: 6,
            gguid: 2,
            weekday: 2,
            time: '8:30h'
        },
        {
            name: 'Berechenbarkeit und Komplexität',
            lecturer: 'Prof. Grohe',
            institute: 'Informatik 1 (Algorithmen und Komplexität) (N.N.) Lehrstuhl für Informatik 7 (Logik und Theorie diskreter Systeme)',
            subsection: 'Praktische Informatik',
            creditpoints: 6,
            gguid: 3,
            weekday: 1,
            time: '10:15h'
        },
        {
            name: 'Content-based Multimedia Search',
            lecturer: 'Prof. Seidl',
            institute: 'Informatik 9 (Datenmanagement und -exploration)',
            subsection: 'Praktische Informatik',
            creditpoints: 6,
            gguid: 4,
            weekday: 6,
            time: '12:15h'
        },
        {
            name: 'Data Mining Algorithmen I',
            lecturer: 'Prof. Seidl',
            institute: 'Informatik 9 (Datenmanagement und -exploration)',
            subsection: 'Cool Informatik',
            creditpoints: 6,
            gguid: 5,
            weekday: 1,
            time: '10:15h'
        },
        {
            name: 'Lorem Ipsum',
            lecturer: 'Mr. Bean',
            institute: 'Informatik 55 (Lorem Ipsum)',
            subsection: 'Ipsum Science',
            creditpoints: 60,
            gguid: 6,
            weekday: 3,
            time: '10:15h'
        },
        {
            name: 'Designing Interactive Systems 1  ',
            lecturer: 'Prof.  Borchers ',
            institute: 'Informatik 10 (Mensch-Computer-Interaktion)',
            subsection: 'Praktische Informatik',
            creditpoints: 6,
            gguid: 7,
            weekday: 2,
            time: '12:15h'
        },
        {
            name: 'Pizza',
            lecturer: 'Mr. Bean',
            institute: 'Informatik 55 (Lorem Ipsum)',
            subsection: 'Lorem Science',
            creditpoints: 6,
            gguid: 8,
            weekday: 2,
            time: '8:30h'
        },
        {
            name: 'Agile Pizza',
            lecturer: 'Mr. Bean',
            institute: 'Informatik 55 (Lorem Ipsum)',
            subsection: 'Lorem Science',
            creditpoints: 2,
            gguid: 9,
            weekday: 4,
            time: '12:15h'
        },
        {
            name: 'Advanced Pizza Eating',
            lecturer: 'Mr. Bean',
            institute: 'Informatik 55 (Lorem Ipsum)',
            subsection: 'Theoretical Computer Science',
            creditpoints: 6,
            gguid: 10,
            weekday: 1,
            time: '10:15h'
        }
    ];


    function mapByGGUID(courses) {
        return courses.reduce(function (accumulator, course) {
            var gguid = course.gguid;
            accumulator[gguid] = course;
            return accumulator;
        }, {});
    }

    // courses is a cache of courses
    function coursesByIDS(coursesCache, ids) {
        var indexedByID = mapByGGUID(coursesCache);
        return ids.map(function (id) {
            return indexedByID[id];
        });
    }

    return {

        // TODO: create cache

        // get list of courses from the server
        get: function () {
            var defered = $q.defer();
            defered.resolve(coursesList);
            return defered.promise;
        },

        // get list of courses of specified IDs
        getByIDs: function (ids) {
            var defered = $q.defer();

            // get courses from cache
            var cachedCourses = coursesByIDS(coursesList, ids);

            // check if all courses were found
            var allFound = cachedCourses.indexOf(undefined) == -1;

            // if all found -> return them
            if (allFound) {
                defered.resolve(cachedCourses);
            }

            // else -> request to the server
            else {
                // TODO
                alert('Cache miss -> TODO');
                defered.reject('Cache miss, TODO -> call server');
            }

            return defered.promise;
        },

        sort: function (courses) {
            var schedule = [
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null]
            ];

            for (var i = 0; i < courses.length; i++) {
                switch (courses[i].time) {
                    case '8:30h':
                        schedule[0][courses[i].weekday - 1] == null ? schedule[0][courses[i].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[0][courses[i].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                    case '10:15h':
                        schedule[1][courses[i].weekday - 1] == null ? schedule[1][courses[i].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[1][courses[i].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                    case '12:15h':
                        schedule[2][courses[i].weekday - 1] == null ? schedule[2][courses[i].weekday - 1] = [{
                            name: courses[i].name,
                            gguid: courses[i].gguid
                        }] : schedule[2][courses[i].weekday - 1].push({name: courses[i].name, gguid: courses[i].gguid});
                        break;
                }
            }

            return schedule;
        },

        getTimes: function () {
            return ['8:30h', '10:15h', '12:15h'];
        }
    }
});