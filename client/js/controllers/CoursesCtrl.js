app.controller('CoursesCtrl', CoursesCtrl);

function CoursesCtrl($scope, localStorageService, $routeParams, $location, Courses) {

    // initialize parameters
    $scope.loading = true;
    $scope.query = {
        order: 'name',
        limit: 10,
        page: 1,
        search: ''
    };

    // get routing parameters
    var semester = $routeParams.semester;
    var field = $routeParams.field;

    // and load corresponding courses
    Courses.get(semester, field).then(function (courses) {
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
        Courses.deleteUnscheduled('o', true);
    };
}