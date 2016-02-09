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

    $scope.querySearch = function querySearch(query) {
        return query ? $filter('filter')($scope.fields, function(value) {
            return contains(value, query);
        }) : $scope.fields;
    };

    $scope.getCourseList = function (semester, field) {

        if (semester == undefined || field == undefined || field == null) {
            var alert = $mdDialog.alert()
                .title('')
                .textContent('Please select your field of study to proceed')
                .ok('Close');
            return $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }

        else {

            // check the field to be valid
            if ($scope.fields.indexOf(field) !== -1) {
                var semesterEncoded = window.encodeURIComponent(semester);
                var fieldEncoded = window.encodeURIComponent(field);
                $location.url('courses/' + semesterEncoded + '/' + fieldEncoded);
            }
        }
    };
}