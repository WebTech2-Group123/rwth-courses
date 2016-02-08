app.controller('DetailsCtrl', function ($scope, $routeParams, $location, localStorageService, Courses) {
    $scope.gguid = $routeParams.gguid;

    function compareString(str1, str2) {
        return str1.indexOf(str2);
    }

    function testEmpty(item) {
        return item.length > 0 ? true : false;
    }

    Courses.getByIDs($scope.gguid).then(function (courses) {

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

    $scope.closeDetails = function () {
        $location.url(localStorageService.get('lastPath'));
    }
})