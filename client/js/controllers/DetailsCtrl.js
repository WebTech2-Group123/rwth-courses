app.controller('DetailsCtrl', function ($scope, $routeParams, $location, $sce, localStorageService, Courses, $window) {

    var gguid = $routeParams.gguid;

    function compareString(str1, str2) {
        return str1.indexOf(str2);
    }

    function testEmpty(item) {
        return item.length > 0;
    }

    Courses.getByIDs(gguid).then(function (courses) {

        // take the course
        $scope.course = courses.pop();

        // set up heading
        $scope.headline = $scope.course.name + ' (' + $scope.course.semester + ')';

        // show german name if it differs from english one
        $scope.showNameDe = function () {
            return compareString($scope.course.name, $scope.course.name_de);
        };

        // show description in german if available
        $scope.showDescriptionDe = function () {
            return compareString($scope.course.description, $scope.course.description_de);
        };

        // show item if available
        $scope.showItem = function (item) {
            return item ? testEmpty(item) : false;
        };

        // show box if at least one item is available
        $scope.showBox = function (items) {
            return items.map(function (item) {
                    return testEmpty(item);
                }).indexOf(true) != -1;
        };
    });

    $scope.goToCampus = function () {
        const BASE_URL = 'https://www.campus.rwth-aachen.de/rwth/all/event.asp?gguid=';
        $window.open(BASE_URL + gguid, '_blank');
    };

    $scope.goBack = function () {
        $location.url(localStorageService.get('lastPath'));
    };
});