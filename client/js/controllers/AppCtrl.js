app.controller('AppCtrl', function ($scope, $location, $log, localStorageService) {

    // check if home page
    $scope.home = true;
    $scope.$on('$locationChangeSuccess', function () {
        $scope.home = $location.path() === '/';
    });

    if (localStorageService.get('selected') && localStorageService.get('selected').length > 0) {
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
                localStorageService.set('coursePath', path);
                localStorageService.set('lastPath', path);
            } else {
                var path = oldUrl.substr(oldUrl.lastIndexOf('/'), oldUrl.length);
                localStorageService.set('lastPath', path);
            }
        }

        if ($location.url().indexOf('/details') == -1) {
            $scope.close = false;
        }

    });

    $scope.goHome = function () {
        $location.url('/');
    };

    $scope.goToRoute = function (target) {
        switch (target) {
            case 'home':
                $location.url('/');
                break;
            case 'courses':
                $location.url(localStorageService.get('coursePath'));
                break;
            case 'overview':
                $location.url('/overview');
                break;
        }
    }

});