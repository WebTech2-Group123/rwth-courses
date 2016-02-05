app.controller('HomeCtrl', HomeCtrl);


function HomeCtrl($scope, $filter, $location, $http, $log, Courses) {

    // clear course list cache
    Courses.clearCache();

    // TODO: get semesters from the backend
    var semesters = [];
    $http({
        method: 'get',
        url: '/api/semesters'
    }).success(function (data) {
        semesters = data;

        // show the latest semester by default
        $scope.currentSemester = semesters[0];
    }).error(function (data) {
        $log.error(data);
    });

    $scope.changeSemester = function () {
        if ($scope.currentSemester == semesters[0]) {
            $scope.currentSemester = semesters[1];
        } else {
            $scope.currentSemester = semesters[0];
        }
    };

    $http({
        method: 'get',
        url: '/api/fields'
    }).success(function (data) {
        $scope.fields = data;
    }).error(function (data) {
        $log.error(data);
    });

    $scope.querySearch = function querySearch(query) {
        return query ? $filter('filter')($scope.fields, query) : $scope.fields;
    };

    $scope.getCourseList = function (semester, field) {

        console.log('getCourseList...');

        var field = field;
        var semester = semester;

        if (semester == undefined || field == null) {
            //some error message
            console.log('return');
            return;
        }

        semester = window.encodeURIComponent(semester);
        field = window.encodeURIComponent(field);

        console.log('Semester: ' + semester + ' >> Field: ' + field);

        //$scope.$parent.courseListExist = false;

        console.log('Path for courses list: courses/' + semester + '/' + field);
        $location.url('courses/' + semester + '/' + field);
    };

}