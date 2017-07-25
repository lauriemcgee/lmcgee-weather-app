var angular = require('angular');
angular.module("weatherApp", [])

// SET UP A FACTORY FOR RECIEVING DEFERRED GEOLOCATION PROMISE

  .factory('getLocation', ['$q', '$window',  function($q, $window) {
    var currentLocation = {};

    currentLocation.getCurrentPosition = function() {
     
      var deferred = $q.defer();
      
      if (!$window.navigator.geolocation) {
        deferred.reject('Geolocation not supported');
     
      } else {
        
        $window.navigator.geolocation.getCurrentPosition(
          
          function(position) {
            deferred.resolve(position);
          },
          
          function(err) {
            deferred.reject(err);
          });

      }
      return deferred.promise;
    };
    return currentLocation;
    
  }])

  // SET UP A FACTORY FOR RECIEVING DEFERRED HTTP PROMISE, DEPENDENT ON RECIEVING GEOLOCATION

  .factory('makeWeatherRequest', ['getLocation', '$http', '$q', function(getLocation, $http, $q) {
    var currentWeather = {};
    

    currentWeather.getCurrentWeather = function(lat, lon) {
      var apiKey = '0dd8bb79c45efccc5e6993ee4b787e33';
      var openWeatherUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
      

      var deferred = $q.defer();
      

      if (!$http.get(openWeatherUrl)) {
        deferred.reject('Something went wrong! Sorry!');
      

      } else {
      

        $http.get(openWeatherUrl).then(
     
          function successCallback(position) {
            deferred.resolve(position);
          },
     
          function errorCallback(err) {
            deferred.reject(err);
          });
      }
      

      return deferred.promise;
    };
    return currentWeather;
  }])


  // SET THE DATA TO THE SCOPE IN THE CONTROLLER, ENSURING HTTP IS COMPLETED AFTR GEOLOCATION

.controller('WeatherCtrl', ['getLocation', 'makeWeatherRequest', '$scope', function(getLocation, makeWeatherRequest, $scope) {
  getLocation.getCurrentPosition().then(function(positionData) {
    $scope.lat = parseFloat(positionData.coords.latitude);
    $scope.lon = parseFloat(positionData.coords.longitude);
    console.log($scope.lat);
    console.log($scope.lon);
  },
  function(err) {
    console.log(err); //User Denid Location -> Set Manually
    $scope.lat = 41.12345;
    $scope.lon = -87.123456;
  }).then(function() {
    makeWeatherRequest.getCurrentWeather($scope.lat, $scope.lon).then(locationData => {
      console.log(locationData);
      $scope.weatherTemp = locationData.data.main.temp;
      $scope.humidity = locationData.data.main.humidity;
      $scope.cloudCover = locationData.data.weather[0].description;
      console.log($scope.weatherTemp);
      console.log($scope.humidity);
      console.log($scope.cloudCover);
    });
  });
}]);





      





