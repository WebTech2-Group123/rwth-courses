app.controller('DetailsCtrl', function($scope, $routeParams, $location, localStorageService){
    $scope.gguid = $routeParams.gguid;

    //console.log(localStorageService.get('lastPath'));

    $scope.closeDetails = function () {
        $location.url(localStorageService.get('lastPath'));
    }
})