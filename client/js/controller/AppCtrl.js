app.controller('AppCtrl', function ($scope, $location, localStorageService) {

    $scope.courseListExist = true;

    if (localStorageService.get('selected').length > 0) {
        $scope.selectedCoursesExist = false;
    } else {
        $scope.selectedCoursesExist = true;
    }

    // cache location of course list
    $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {

        if (newUrl) {
            if (newUrl.indexOf('/course') != -1) {
                $scope.courseListExist = false;
            }
        }

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

        $scope.courseActive = function (path) {

            // get the beginning of the current path
            var currLocation = '/' + ($location.url().split('/', 2)).join('');

            return (path == currLocation);
        }

    });

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