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
        templateUrl: 'templates/app.html'
    };
});

// router & local storage
app.config(function ($routeProvider, localStorageServiceProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        })
        .when('/courses', {
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
        .setPrefix('Campus')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
});