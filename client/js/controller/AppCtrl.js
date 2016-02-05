app.controller('AppCtrl', function ($scope, $location, $log, localStorageService) {

    $scope.courseListExist = true;

    if (localStorageService.get('selected') && localStorageService.get('selected').length > 0) {
        $scope.selectedCoursesExist = false;
    } else {
        $scope.selectedCoursesExist = true;
    }

    // cache location of course list
    $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        //console.log('New URL: ' + newUrl);
        //console.log('Old URL: ' + oldUrl);
        //console.log(typeof newUrl);
        //console.log(typeof oldUrl);

        // enable course list tab
        if (newUrl) {
            if (newUrl.indexOf('/courses') != -1) {
                $scope.courseListExist = false;
            }
        }

        if (oldUrl) {
            if (oldUrl.lastIndexOf('/courses') != -1) {
                var index = oldUrl.lastIndexOf('/courses');
                var path = oldUrl.substr(index, oldUrl.length);
                //console.log('Path courses: ' + path);
                localStorageService.set('coursePath', path);
                localStorageService.set('lastPath', path);
            } else {
                var path = oldUrl.substr(oldUrl.lastIndexOf('/'), oldUrl.length);
                localStorageService.set('lastPath', path);
                //console.log('Path everything else: ' + path);
            }

        }

        //console.log('Storage coursePath: ' + localStorageService.get('coursePath'));
        //console.log('STorage lastPath: ' + localStorageService.get('lastPath'));
        //
        //console.log('----------------------');

    });

    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        //console.log('Old route: ' + oldRoute);
        //console.log(oldRoute);
        //console.log('New route: ' + newRoute);
        //console.log(newRoute);
    });

    //$scope.courseActive = function (path) {
    //
    //    var  path = path;
    //
    //    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute){
    //
    //        console.log(path);
    //
    //        var currLocation = '';
    //
    //        // get the beginning of the current path
    //        console.log("Location URL: " + $location.url());
    //        if ($location.url() != '/null') {
    //            currLocation = '/' + ($location.url().split('/', 2)).join('');
    //            console.log("currLocation: " + currLocation);
    //        } else {
    //            currLocation = localStorageService.set('coursePath', path);
    //            $log.error('Location URL is null');
    //            return;
    //        }
    //
    //        return (path == currLocation);
    //
    //    })
    //
    //}

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