app.controller('OverviewCtrl', function ($scope, $rootScope, localStorageService, $location, $log, Courses) {

    // TODO: useful?
    $scope.loading = true;

    // times for the schedule
    $scope.times = Courses.getTimes();

    // load courses from local storage
    var ids = localStorageService.get('selected') || [];

    // retrieve courses
    Courses.getByIDs(ids).then(function (courses) {
        $scope.courses = courses;
        console.log(courses);
        $scope.schedule = Courses.sort($scope.courses);
        //$scope.unscheduled = localStorageService.get('unscheduled');
        $scope.unscheduled = Courses.getUnscheduled();
        $scope.loading = false;
    });

    //TODO: list unscheduled courses

    $scope.deleteCourse = function (gguid) {

        // filter courses by deleted course
        $scope.courses = $scope.courses.filter(function (course) {
            return course.gguid != gguid;
        });

        // filter unscheduled courses
        Courses.deleteUnscheduled(gguid);

        // update schedule
        $scope.schedule = Courses.sort($scope.courses);

        // update unscheduled
        $scope.unscheduled = Courses.getUnscheduled();

        // filter local storage by deleted course
        var coursesIDs = localStorageService.get('selected').filter(function (storageGguid) {
            return storageGguid != gguid;
        });

        // update local storage
        localStorageService.set('selected', coursesIDs);

        console.log(localStorageService.get('selected').length);

        // go back to courses list if schedule is empty
        if (localStorageService.get('selected').length == 0) {
            $location.url(localStorageService.get('coursePath'));
        }
    }

    // show details page
    $scope.goToDetails = function (gguid) {
        $location.url('details/' + gguid);
    }

    $scope.goBack = function () {
        $location.url(localStorageService.get('coursePath'));
    }

});