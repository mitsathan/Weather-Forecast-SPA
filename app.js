//MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//ROUTES
weatherApp.config(['$routeProvider', function ($routeProvider) {
    //weatherApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    //
    //    $locationProvider.html5Mode({
    //        enable: true,
    //        requireBase: false
    //    });
    //    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })
        .when('/forecast/:city', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        });

}]);

//SERVICES
weatherApp.service('cityService', function () {

    this.cityName = "Athens,GR";

});

weatherApp.service('weatherService', ['$resource', function ($resource) {

    //http://api.openweathermap.org/data/2.5/forecast/daily?APPID=76c940e8f389c73019ddd93be5672b2c
    //$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
    this.GetWeather = function (city) {

        var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/weather", {
            callback: "JSON_CALLBACK"
        }, {
            get: {
                method: "JSONP"
            }
        });

        return weatherAPI.get({
            q: city,
            APPID: '76c940e8f389c73019ddd93be5672b2c'
        });
    };

}]);

//CONTROLLERS
weatherApp.controller('homeController', ['$scope', '$http', '$location', 'cityService', function ($scope, $http, $location, cityService) {

    $scope.city = cityService.cityName;

    $http.get('city.list.json').success(function (data) {
        $scope.cities = data;
    });

    $scope.$watch('city', function () {
        cityService.cityName = $scope.city;
    });

    $scope.submit = function () {
        $location.path("/forecast");
    };

}]);

weatherApp.controller('forecastController', ['$scope', '$routeParams', 'cityService', 'weatherService', function ($scope, $routeParams, cityService, weatherService) {

    $scope.city = $routeParams.city || cityService.cityName;

    var weatherCity1 = weatherService.GetWeather("Athens,GR");
    var weatherCity2 = weatherService.GetWeather($scope.city);

    $scope.weatherResult = [weatherCity1, weatherCity2];

    $scope.convertToCelsius = function (degK) {

        return (degK - 273.15);
    }

    $scope.convertToDate = function (dt) {

        return new Date(dt * 1000);
    }


}]);

//DIRECTIVES
weatherApp.directive("weatherReport", function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            k: "=",
            v: "=",
            convertToStandard: "&",
            convertToDate: "&",
            dateFormat: "@"
        }
    }
});
