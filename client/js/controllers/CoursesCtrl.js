app.controller('CoursesCtrl', CoursesCtrl);

function CoursesCtrl($scope, localStorageService, $routeParams, $location, Courses) {

    // initialize parameters
    $scope.loading = true;
    $scope.table = {
        order: 'name',
        limit: 10,
        page: 1
    };

    $scope.search = '';
    $scope.type = {
        lecture: true,
        exercise: false,
        other: false
    };
    $scope.languages = {
        en: true,
        de: true,
        other: true
    };

    function normalize(string) {
        return string.toLowerCase()
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/ü/g, 'u')
            .replace(/ß/g, 'ss');
    }

    function contains(string, query) {
        return normalize(string).indexOf(normalize(query)) >= 0;
    }

    function containsArray(array, query) {
        return array.reduce(function (acc, string) {
            return acc || contains(string, query);
        }, false);
    }

    // filter by text
    $scope.textFilter = function (course) {
        var query = $scope.search.trim();
        if (query.length === 0) {
            return true;
        } else {
            var lecturers = course.contact.map(function (el) {
                return el.name;
            });
            return contains(course.name, query) ||
                containsArray(lecturers, query) ||
                containsArray(course.units, query);
        }
    };

    // filter for languages
    $scope.languageFilter = function (course) {
        var language = course.language;
        var en = $scope.languages.en;
        var de = $scope.languages.de;
        var other = $scope.languages.other;
        return (en && language.indexOf('EN') >= 0) ||
            (de && language.indexOf('DE') >= 0) ||
            (other && language.indexOf('EN') < 0 && language.indexOf('DE'));
    };

    // filter for type
    $scope.typeFilter = function (course) {
        var type = course.type;
        var lecture = $scope.type.lecture;
        var exercise = $scope.type.exercise;
        var other = $scope.type.other;
        return (lecture && type.indexOf('Lecture') >= 0) ||
            (exercise && type.indexOf('Exercise') >= 0) ||
            (other && type.indexOf('Lecture') === -1 && type.indexOf('Exercise') === -1);
    };

    // get routing parameters
    $scope.semester = $routeParams.semester;
    $scope.field = $routeParams.field;

    // and load corresponding courses
    Courses.get($scope.semester, $scope.field).then(function (courses) {
        $scope.courses = courses;
        $scope.loading = false;

        // if no lectures, show everything
        var numberOfLectures = courses.reduce(function (acc, curr) {
            return acc + ((curr.type.indexOf('Lecture') >= 0) ? 1 : 0);
        }, 0);
        if (numberOfLectures === 0) {
            $scope.type = {
                lecture: true,
                exercise: true,
                other: true
            }
        }
    });

    // get selected courses from local storage
    $scope.selected = localStorageService.get('selected') || [];

    // store courses into local storage on changes
    $scope.$watchCollection('selected', function (selected) {
        localStorageService.set('selected', selected);
        $scope.disableBtn = $scope.selected.length == 0;
    });

    // when course clicked -> go to detail page
    $scope.showDetails = function (gguid) {
        $location.url('/details/' + gguid);
    };

    // back button
    $scope.goBack = function () {
        $location.url('/');
    };

    // schedule button
    $scope.showSchedule = function () {
        $location.url('overview');
    };

    // clear button
    $scope.clearAll = function () {
        $scope.selected = [];

        // clear unschedulded
        Courses.resetUnscheduled();
    };
}