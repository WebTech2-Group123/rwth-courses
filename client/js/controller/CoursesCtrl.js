app.controller('CoursesCtrl', CoursesCtrl);

function CoursesCtrl($scope, localStorageService, $routeParams, $location, Courses) {

    // store route params
    var semester = window.decodeURIComponent($routeParams.semester);
    var field = $routeParams.field;

    // get courses from local storage
    $scope.selected = localStorageService.get('selected') || [];

    // store courses into local storage on changes
    $scope.$watchCollection('selected', function (selected) {
        localStorageService.set('selected', selected);

        if ($scope.selected.length != 0) {
            // enable tab
            $scope.$parent.selectedCoursesExist = false;
        } else {
            // disable tab
            $scope.$parent.selectedCoursesExist = true;
        }
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

        $scope.$parent.courseListExist = false;
    });

    $scope.showDetails = function (gguid) {
        console.log(gguid);
        $location.url('/details/' + gguid);
    }

    $scope.clearAll = function () {

        // clear array
        $scope.selected = [];
    };
}