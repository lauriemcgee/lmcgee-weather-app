var angular = require('angular');
var moment = require('moment');
angular.module("weatherApp", [])

// FACTORY TO MAKE DEFERRED PROMISE REQUEST FOR CURRENT WEATHER

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

// FACTORY TO MAKE DEFERRED PROMISE REQUEST FOR CURRENT WEATHER

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


// FACTORY TO MAKE DEFERRED PROMISE REQUEST FOR FORECASTED WEATHER

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


  

.controller('WeatherCtrl', ['getLocation', 'makeWeatherRequest', 'makeForecastRequest', '$scope', function(getLocation, makeWeatherRequest, makeForecastRequest, $scope) {

// SET THE DATA TO THE SCOPE IN THE CONTROLLER
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
  // COMPLETE HTTP REQUEST FOR CURRENT WEATHER AFTER GEOLOCATION CALL
    .then(function() {
      makeWeatherRequest.getCurrentWeather($scope.lat, $scope.lon).then(locationData => {
        $scope.weatherTemp = Math.floor(locationData.data.main.temp);
        $scope.tempMax = Math.floor(locationData.data.main.temp_max);
        $scope.tempMin = Math.floor(locationData.data.main.temp_min);
        $scope.humidity = Math.floor(locationData.data.main.humidity);
        $scope.cloudCover = locationData.data.weather[0].description;

// ONCE WE HAVE SOME DATA, LET THE USER SEE IT 

        $scope.dataLoad = !$scope.dataLoad;
        $scope.dataReady = !$scope.dataReady;
      })

// COMPLETE HTTP REQUEST FOR FORECASTED WEATHER AFTER CURRENT WEATHER CALL
    .then(function() {
      makeForecastRequest.getForecastWeather($scope.lat, $scope.lon).then(locationData => {
        $scope.forecastDatas = locationData.data;
        var forecastDatas = locationData.data.list;

// THESE CALCULATIONS SHOULD BE LOCATED ELSEWHERE, POSSIBLY A SERVICE
// GRAB FORECASTS FOR EACH DAY (FORECASTS ARE GIVEN EVERY 3-HOURS)

        $scope.forecastedDay = [];
        for (var i = 0; i < forecastDatas.length; i += 8) {
          $scope.forecastedDay.push(forecastDatas[i]);
        }
        
// ATTACH NEW COLLECTION OF FORMATTED DAYS TO THE DATA OBJECTS

        $scope.days = [];
        for (i = 0; i < $scope.forecastedDay.length; i++) {
          $scope.days.push({day: moment($scope.forecastedDay[i].dt_txt).format('ddd').toUpperCase() });
        }

// BIND THE TWO TOGETHER FOR NG REPEAT DIRECTIVE

        $scope.repeatData = $scope.forecastedDay.map(function(value, index) {
          return {
              data: value,
              value: $scope.days[index]
          };
        });
      });
    });
    });
}]);





      





