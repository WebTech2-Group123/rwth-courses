app.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $filter, $location, $http, Courses) {

    // TODO: get semesters from the backend
    var semesters = ["WS 2015/2016", "SS 2015"];

    // show the latest semester by default
    $scope.currentSemester = semesters[0];

    $scope.changeSemester = function () {
        if($scope.currentSemester == semesters[0]){
            $scope.currentSemester = semesters[1];
        }else{
            $scope.currentSemester = semesters[0];
        }
    }

    $scope.fields = ["Architektur (D)", "Bauingenieurwesen (D)", "Metallurgie und Werkstofftechnik (D)", "Werkstoffinformatik (D)", "Wirtschaftsingenieurwesen FR Bauingenieurwesen (D)", "Technik-Kommunikation (M.A.)", "Erziehungswissenschaftliches Studium (GYM+GS,BK,SII)", "Faszination Technik (GYM+GS,BK)", "Neue Medien (GYM+GS,BK,SII)", "Bautechnik (BK,SII)", "Biologie (GYM+GS,BK,SII)", "Chemie (GYM+GS,BK,SII)", "Deutsch (GYM+GS,BK,SII)", "Elektrotechnik (BK,SII)", "Energietechnik (BK,SII)", "Englisch (GYM+GS,BK,SII)", "Evangelische Religionslehre (SII)", "Fahrzeugtechnik (BK,SII)", "Fertigungstechnik (BK,SII)", "Französisch (GYM+GS,BK,SII)"];

    $scope.querySearch = function querySearch (query) {
        return query ? $filter('filter')($scope.fields, query) : $scope.fields;
    };

    $scope.getCourseList = function(semester, field){

        if(semester == undefined || field == null ){
            //some error message
            return;
        }

        var result = Courses.getCoursesFromServer(semester, field);
        //if (result)
        
        $location.path('/courses');
    };

}