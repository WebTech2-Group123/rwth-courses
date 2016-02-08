var app = angular.module('Campus', [
    'ngRoute',
    'ngMaterial',
    'md.data.table',
    'angular.filter',
    'LocalStorageModule'
]);

// contains the whole app
// used to show the loading screen while Angular is loading
app.directive('app', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/app.html',
        controller: 'AppCtrl'
    };
});

// simple directive to show a circular progress bar
app.directive('loading', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/loading.html'
    }
});

// bind enter key
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

// router & local storage
app.config(function ($routeProvider, localStorageServiceProvider) {

    $routeProvider
        .when('/', {
            // managed in the AppCtrl and app.html template
        })
        .when('/courses/:semester/:field', {
            templateUrl: 'templates/courses.html',
            controller: 'CoursesCtrl'
        })
        .when('/overview', {
            templateUrl: 'templates/overview.html',
            controller: 'OverviewCtrl'
        })
        .when('/details/:gguid', {
            templateUrl: 'templates/details.html',
            controller: 'DetailsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    localStorageServiceProvider
        .setPrefix('RWTH Courses')
        .setStorageType('localStorage')
        .setNotify(true, true);
});