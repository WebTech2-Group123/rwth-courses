app.controller('OverviewCtrl', function ($scope, localStorageService, $location, $log, Courses) {

    // TODO: useful?
    $scope.loading = true;

    // times for the schedule
    $scope.times = Courses.getTimes();

    // load courses from local storage
    var ids = localStorageService.get('selected') || [];

    console.log('IDs: ' + ids);

    // retrieve courses
    Courses.getByIDs(ids).then(function (courses) {
        $scope.courses = courses;
        $scope.schedule = Courses.sort($scope.courses);
        $scope.loading = false;
    });

    $scope.deleteCourse = function (gguid) {

        // filter courses by deleted course
        $scope.courses = $scope.courses.filter(function (course) {
            return course.gguid != gguid;
        });

        // update schedule
        $scope.schedule = Courses.sort($scope.courses);

        // filter local storage by deleted course
        var coursesIDs = localStorageService.get('selected').filter(function (storageGguid) {
            return storageGguid != gguid;
        });

        // update local storage
        localStorageService.set('selected', coursesIDs);
    }

    // show details page
    $scope.goToDetails = function (gguid) {
        $location.url('details/' + gguid);
    }

    // go back button
    $scope.goBack = function () {
        $location.url('courses');
    }
});