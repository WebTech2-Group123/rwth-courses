app.controller('DetailsCtrl', function ($scope, $routeParams, $location, $sce, localStorageService, Courses) {
    var gguid = $routeParams.gguid;

    $scope.$parent.close = true;

    function compareString(str1, str2) {
        return str1.indexOf(str2);
    }

    function testEmpty(item) {
        return item.length > 0 ? true : false;
    }

    Courses.getByIDs(gguid).then(function (courses) {

        // take the course
        $scope.course = courses.pop();

        // show german name if it differs from english one
        $scope.showNameDe = function () {
            return compareString($scope.course.name, $scope.course.name_de);
        }

        // show description in german if available
        $scope.showDescriptionDe = function () {
            return compareString($scope.course.description, $scope.course.description_de);
        }

        // show item if available
        $scope.showItem = function (item) {
            return item ? testEmpty(item) : false;
        }

        // show box if at least one item is available
        $scope.showBox = function (items) {
            return items.map(function (item) {
                    return testEmpty(item);
                }).indexOf(true) != -1;
        }
    });

    $scope.$parent.goToCampus = function () {
        const BASE_URL = 'https://www.campus.rwth-aachen.de/rwth/all/event.asp?gguid=';

        console.log(BASE_URL + gguid);

        return $sce.trustAsResourceUrl(BASE_URL + gguid);
    }

    $scope.$parent.closeDetails = function () {
        $scope.$parent.close = false;
        $location.url(localStorageService.get('lastPath'));
    }
});