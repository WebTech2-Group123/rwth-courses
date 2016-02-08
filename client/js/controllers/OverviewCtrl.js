app.controller('OverviewCtrl', function ($scope, $rootScope, localStorageService, $location, $log, Courses) {

    // times for the schedule
    $scope.times = Courses.getTimes();

    // arr for unscheduled courses
    $scope.unscheduled = [];

    // load courses from local storage
    var ids = localStorageService.get('selected') || [];

    // retrieve courses
    Courses.getByIDs(ids).then(function (courses) {
        $scope.courses = courses;
        $scope.schedule = Courses.sort($scope.courses);
        $scope.unscheduled = Courses.getUnscheduled();
    });

    // if arr unscheduled is not empty, display the panel for unscheduled courses
    $scope.showUnscheduled = function () {
        return $scope.unscheduled.length > 0;
    };

    $scope.deleteCourse = function (gguid) {

        // filter courses by deleted course
        $scope.courses = $scope.courses.filter(function (course) {
            return course.gguid != gguid;
        });

        // reset unscheduled courses
        Courses.resetUnscheduled();

        // update schedule (both: events already in schedule an those which are not)
        $scope.schedule = Courses.sort($scope.courses);

        // update unscheduled
        $scope.unscheduled = Courses.getUnscheduled();

        // filter local storage by deleted course
        var coursesIDs = localStorageService.get('selected').filter(function (storageGguid) {
            return storageGguid != gguid;
        });

        // update local storage
        localStorageService.set('selected', coursesIDs);

        // go back to courses list if schedule is empty
        if (localStorageService.get('selected').length == 0) {
            $location.url(localStorageService.get('coursePath'));
        }
    };

    // show details page
    $scope.goToDetails = function (gguid) {
        $location.url('details/' + gguid);
    };

    $scope.goBack = function () {
        $location.url(localStorageService.get('coursePath'));
    };

});