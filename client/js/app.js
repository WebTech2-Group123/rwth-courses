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
        template: '' +
        '<div layout="row" layout-align="center center" ng-show="loading">' +
        '    <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>' +
        '    <p>Loading...</p>' +
        '</div>'
    }
});

// router & local storage
app.config(function ($routeProvider, localStorageServiceProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
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