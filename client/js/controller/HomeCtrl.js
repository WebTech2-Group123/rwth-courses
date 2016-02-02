app.controller('HomeCtrl', HomeCtrl);


function HomeCtrl($scope, $filter, $location, $http, $log) {

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

    //$scope.fields = ["Architektur (D)", "Bauingenieurwesen (D)", "Metallurgie und Werkstofftechnik (D)", "Werkstoffinformatik (D)", "Wirtschaftsingenieurwesen FR Bauingenieurwesen (D)", "Technik-Kommunikation (M.A.)", "Erziehungswissenschaftliches Studium (GYM+GS,BK,SII)", "Faszination Technik (GYM+GS,BK)", "Neue Medien (GYM+GS,BK,SII)", "Bautechnik (BK,SII)", "Biologie (GYM+GS,BK,SII)", "Chemie (GYM+GS,BK,SII)", "Deutsch (GYM+GS,BK,SII)", "Elektrotechnik (BK,SII)", "Energietechnik (BK,SII)", "Englisch (GYM+GS,BK,SII)", "Evangelische Religionslehre (SII)", "Fahrzeugtechnik (BK,SII)", "Fertigungstechnik (BK,SII)", "Französisch (GYM+GS,BK,SII)"];

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


        var semester = window.encodeURIComponent(semester);

        console.log(semester + '      ' + field);

        if (semester == undefined || field == null) {
            //some error message
            return;
        }


        // TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //var result = Courses.getCoursesFromServer(semester, field);
        //if (result)

        // pass semester and field to the next route
        $location.path('courses/' + semester + '/' + field);
    };

}