var angular = require('angular');

var myApp = angular.module('weatherApp', []);

// Creating the module's controller with data to ensure it works

myApp.controller('weatherCtrl', function($scope, $http) {
  var vm = $scope;
  vm.channelInfo = {
    heading: 'Rocketmiles OpenWeather App',
    subheading1: 'Looking for the weather?'
  };

// Getting the user's latitude and longitude, building url for api request

  window.navigator.geolocation.getCurrentPosition(function(data) {
    console.log(data);
    vm.lat = parseFloat(data.coords.latitude);
    vm.lon = parseFloat(data.coords.longitude);
    var apiKey = '0dd8bb79c45efccc5e6993ee4b787e33';
    var openWeatherUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + vm.lat + '&lon=' + vm.lon + '&appid=' + apiKey + '&units=imperial';

  // Making the api call-storing response data

    $http.get(openWeatherUrl).then(function(responseWeather) {
      console.log(responseWeather);
      vm.weatherTemp = responseWeather.data.main.temp;
      vm.humidity = responseWeather.data.main.humidity;
      vm.cloudCover = responseWeather.data.weather[0].description;
      console.log(vm.cloudCover);
      console.log(vm.weatherTemp);
      console.log(vm.humidity);

    });
  });
});