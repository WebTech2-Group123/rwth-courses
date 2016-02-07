app.controller('CoursesCtrl', CoursesCtrl);

function CoursesCtrl($scope, localStorageService, $routeParams, $location, $log, Courses) {

    $scope.loading = true;

    var semester = $routeParams.semester;
    var field = $routeParams.field;

    // get selected courses from local storage
    $scope.selected = localStorageService.get('selected') || [];
    $log.info($scope.selected);

    // store courses into local storage on changes
    $scope.$watchCollection('selected', function (selected) {
        localStorageService.set('selected', selected);

        console.log(selected);

        if ($scope.selected.length != 0) {
            // enable tab
            $scope.disableBtn = false;
        } else {
            // disable tab
            $scope.disableBtn = true;
        }
    });

    $scope.query = {
        order: 'name',
        limit: 10,
        page: 1,
        search: ''
    };

    Courses.get(semester, field).then(function (courses) {
        $scope.courses = courses;
        $scope.loading = false;
    });

    $scope.showDetails = function (gguid) {
        console.log(gguid);
        $location.url('/details/' + gguid);
    };

    $scope.goBack = function () {
        $location.url('/');
    };

    $scope.showSchedule = function () {
        $location.url('overview');
    };

    $scope.clearAll = function () {

        // clear array
        $scope.selected = [];

        // clear unschedulded
        Courses.deleteUnscheduled('o', true);
    };
}