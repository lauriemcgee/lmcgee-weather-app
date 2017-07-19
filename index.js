var angular = require('angular');

var myApp = angular.module('weatherApp', []);

myApp.controller('weatherCtrl', function($scope, $http) {
  var vm = $scope;
  vm.channelInfo = {
    heading: 'Rocketmiles OpenWeather App',
    subheading1: 'Looking for the weather?'
  };
});