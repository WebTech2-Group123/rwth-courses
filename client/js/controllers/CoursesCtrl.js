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
        vorlesung: true,
        ubung: false,
        other: false
    };
    $scope.languages = {
        en: true,
        de: true,
        other: true
    };

    // filter for languages
    $scope.languageFilter = function (value) {
        var language = value.language;
        var en = $scope.languages.en;
        var de = $scope.languages.de;
        var other = $scope.languages.other;
        return (en && language.indexOf('EN') >= 0) ||
            (de && language.indexOf('DE') >= 0) ||
            (other && language.indexOf('EN') < 0 && language.indexOf('DE'));
    };

    // filter for type
    $scope.typeFilter = function (value) {
        var type = value.type;
        var vorlesung = $scope.type.vorlesung;
        var ubung = $scope.type.ubung;
        var other = $scope.type.other;
        return (vorlesung && type.indexOf('Vorlesung') >= 0) ||
            (ubung && type.indexOf('Übung') >= 0) ||
            (other && type.indexOf('Vorlesung') === -1 && type.indexOf('Übung') === -1);
    };

    // get routing parameters
    $scope.semester = $routeParams.semester;
    $scope.field = $routeParams.field;

    // and load corresponding courses
    Courses.get($scope.semester, $scope.field).then(function (courses) {
        $scope.courses = courses;
        $scope.loading = false;
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