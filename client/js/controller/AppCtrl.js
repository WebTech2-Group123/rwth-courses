app.controller('AppCtrl', function ($scope, $location, localStorageService) {

    $scope.courseListExist = true;

    if (localStorageService.get('selected')) {
        $scope.selectedCoursesExist = false;
    } else {
        $scope.selectedCoursesExist = true;
    }

    // cache location of course list
    $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        if (oldUrl) {
            if (oldUrl.lastIndexOf('/courses') != -1) {
                var index = oldUrl.lastIndexOf('/courses');
                var path = oldUrl.substr(index, oldUrl.length);
                $scope.courseRoute = path;
            }
        }
    });

    $scope.goToRoute = function (target) {
        switch (target) {
            case 'home':
                $location.url('/');
                break;
            case 'courses':
                $location.url($scope.courseRoute);
                break;
            case 'overview':
                $location.url('/overview');
                break;
        }
    }

});