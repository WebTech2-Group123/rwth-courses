app.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $filter, $location, $mdDialog, $q, Courses) {

    // clear course list cache
    Courses.clearCache();

    // init variables
    $scope.loading = true;
    var semesters = [];
    $scope.fields = [];

    // load semesters & fields from server
    $q.all([Courses.getSemesters(), Courses.getFields()]).then(function (values) {

        // extract data
        semesters = values[0];
        $scope.fields = values[1];

        // show the latest semester by default
        $scope.currentSemester = semesters[0];

        // not loading anymore...
        $scope.loading = false;
    });


    $scope.changeSemester = function () {
        if ($scope.currentSemester == semesters[0]) {
            $scope.currentSemester = semesters[1];
        } else {
            $scope.currentSemester = semesters[0];
        }
    };


    $scope.querySearch = function querySearch(query) {
        return query ? $filter('filter')($scope.fields, query) : $scope.fields;
    };

    $scope.getCourseList = function (semester, field) {

        if (semester == undefined || field == undefined || field == null) {
            var alert;
            //some error message
            alert = $mdDialog.alert()
                .title('')
                .textContent('Please select your field of study to proceed')
                .ok('Close');
            return $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }

        semester = window.encodeURIComponent(semester);
        field = window.encodeURIComponent(field);

        console.log('Semester: ' + semester + ' >> Field: ' + field);

        //$scope.$parent.courseListExist = false;

        console.log('Path for courses list: courses/' + semester + '/' + field);
        $location.url('courses/' + semester + '/' + field);
    };

}