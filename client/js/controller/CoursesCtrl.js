app.controller('CoursesCtrl', CoursesCtrl);

function CoursesCtrl($scope, localStorageService, $location, $routeParams, Courses) {

    // store route params
    var semester = window.decodeURIComponent($routeParams.semester);
    var field = $routeParams.field;

    // get courses from local storage
    $scope.selected = localStorageService.get('selected') || [];
    console.log($scope.selected);

    // store courses into local storage on changes
    $scope.$watchCollection('selected', function (selected) {
        localStorageService.set('selected', selected);
    });

    $scope.query = {
        order: 'name',
        limit: 10,
        page: 1,
        search: ''
    };


    $scope.courses = [];

    Courses.get(semester, field).then(function (courses) {
        $scope.courses = courses;

        // save courses in browser storage
        localStorageService.set('courses', courses);
    });

    $scope.goBack = function () {
        $location.url('/');
    };

    $scope.clearAll = function () {

        // clear array
        $scope.selected = [];
    };

    $scope.showOverview = function () {
        $location.url('overview');
    }
}