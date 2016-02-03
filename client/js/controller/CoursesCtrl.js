app.controller('CoursesCtrl', CoursesCtrl);

function CoursesCtrl($scope, localStorageService, $location, $routeParams, Courses) {

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

        //for (var i = 0; i < courses.length; i++) {
        //    if (courses[i].gguid == '0x5463984FF379974D896EB4BF748D013E') {
        //        console.log(courses[i]);
        //    }
        //}

    });

    /*$scope.goBack = function () {
        $location.url('/');
    };*/

    $scope.clearAll = function () {

        // clear array
        $scope.selected = [];
    };

    /*$scope.showOverview = function () {
        $location.url('overview');
    }*/
}