var app = angular.module('Campus', [
    'ngRoute',
    'ngMaterial',
    'md.data.table',
    'angular.filter',
    'LocalStorageModule',
    'door3.css'
]);

// contains the whole app
// used to show the loading screen while Angular is loading
app.directive('app', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/app.html',
        css: 'css/desktop/app.css'
    };
});

// router & local storage
app.config(function ($routeProvider, localStorageServiceProvider, $cssProvider) {

    // config for responsive design
    angular.extend($cssProvider.defaults, {
        breakpoints: {
            mobile: '(max-width: 480px)',
            tablet: '(min-width: 768px) and (max-width: 1024px)',
            desktop: '(min-width: 1224px)'
        }
    });

    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl',
            css: 'css/desktop/home.css'
        })
        .when('/courses', {
            templateUrl: 'templates/courses.html',
            controller: 'CoursesCtrl'
        })
        .when('/overview', {
            templateUrl: 'templates/overview.html',
            controller: 'OverviewCtrl',
            css: [
                {
                    href: 'css/desktop/overview.css',
                    breakpoint: 'mobile'
                },
                {
                    href: 'css/desktop/overview.css',
                    breakpoint: 'tablet'
                },
                {
                    href: 'css/desktop/overview.css',
                    breakpoint: 'desktop'
                }
            ]
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