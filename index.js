var angular = require('angular');
var moment = require('moment');
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

  // FACTORY TO MAKE REQUEST FOR CURRENT WEATHER

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
     
          function successCallback(data) {
            deferred.resolve(data);
          },
     
          function errorCallback(err) {
            deferred.reject(err);
          });
      }
      return deferred.promise;
    };
    return currentWeather;
  }])


  // FACTORY TO MAKE REQUEST FOR FORECASTED WEATHER

.factory('makeForecastRequest', ['getLocation', '$http', '$q', function(getLocation, $http, $q) {
  var forecastWeather = {};

  forecastWeather.getForecastWeather = function(lat, lon) {
    var apiKey = '0dd8bb79c45efccc5e6993ee4b787e33';
    var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    var deferred = $q.defer();
      

    if (!$http.get(forecastUrl)) {
      deferred.reject('Something went wrong! Sorry!');
    

    } else {
    

      $http.get(forecastUrl).then(
   
        function successCallback(data) {
          deferred.resolve(data);
        },
   
        function errorCallback(err) {
          deferred.reject(err);
        });
    }
    
    return deferred.promise;

  };
  return forecastWeather;

}])


  // SET THE DATA TO THE SCOPE IN THE CONTROLLER, ENSURING HTTP REQUEST IS COMPLETED AFTR GEOLOCATION IS RECIEVED

.controller('WeatherCtrl', ['getLocation', 'makeWeatherRequest', 'makeForecastRequest', '$scope', function(getLocation, makeWeatherRequest, makeForecastRequest, $scope) {
  
  getLocation.getCurrentPosition().then(function(positionData) {
    $scope.lat = parseFloat(positionData.coords.latitude);
    $scope.lon = parseFloat(positionData.coords.longitude);
  },
  // IF USER DOESN'T WANT TO GIVE US THEIR LOCATION, THEN SO BE IT
  function(err) {
    console.log(err); 
    $scope.lat = 41.12345;
    $scope.lon = -87.123456;
  })
    .then(function() {
      makeWeatherRequest.getCurrentWeather($scope.lat, $scope.lon).then(locationData => {
        $scope.weatherTemp = Math.floor(locationData.data.main.temp);
        $scope.tempMax = Math.floor(locationData.data.main.temp_max);
        $scope.tempMin = Math.floor(locationData.data.main.temp_min);
        $scope.humidity = Math.floor(locationData.data.main.humidity);
        $scope.cloudCover = locationData.data.weather[0].description;
        $scope.dataLoad = !$scope.dataLoad;
        $scope.dataReady = !$scope.dataReady;
      })

    .then(function() {
      makeForecastRequest.getForecastWeather($scope.lat, $scope.lon).then(locationData => {
        $scope.forecastDatas = locationData.data;
        var forecastDatas = locationData.data.list;
        $scope.forecastedDay = [];
        for (var i = 0; i < forecastDatas.length; i+=8) {
          $scope.forecastedDay.push(forecastDatas[i]);
        }
        
        $scope.days = [];
        for (i = 0; i < $scope.forecastedDay.length; i++) {
          $scope.days.push({day: moment($scope.forecastedDay[i].dt_txt).format('ddd').toUpperCase() });
        }

        $scope.repeatData = $scope.forecastedDay.map(function(value, index) {
          return {
              data: value,
              value: $scope.days[index]
          };
        });

        console.log($scope.repeatData);
        console.log($scope.days);
        console.log($scope.forecastedDay);
        console.log($scope.forecastDatas);
      });
    });
    });
}]);





      





