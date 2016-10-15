'use strict';

// Parse.initialize("vg5DNYWm1N6NFmsxOfywBIXEi9IKdPJABA1K87s4", "GUJvPKNcsyel3Qfrq6EQZRn5lMJGmKpJ0PZep7O6");



var app = angular.module('BE', ['ngRoute','LocalStorageModule','chart.js']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider,localStorageServiceProvider) {

	$routeProvider
	.when('/', {
		templateUrl: 'js/pages/home/home.html',
		controller: 'HomeCtrl'
	})
	.when('/products', {
		templateUrl: 'js/pages/products/products.html',
		controller: 'ProductsCtrl'
	})
	.when('/categories', {
		templateUrl: 'js/pages/categories/categories.html',
		controller: 'CategoriesCtrl'
	})
	.when('/orders', {
		templateUrl: 'js/pages/orders/orders.html',
		controller: 'OrdersCtrl'
	})
	.when('/buyers', {
		templateUrl: 'js/pages/buyers/buyers.html',
		controller: 'BuyersCtrl'
	})
	.when('/settings', {
		templateUrl: 'js/pages/settings/settings.html',
		controller: 'SettingsCtrl',
		controllerAs: 'sets'
	})
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);

}]).run(['$window', '$rootScope', function($window, $rootScope) {
	// document.addEventListener("deviceready", function () {
  		$rootScope.$on('$afterRouteChange', function() {
			$window.scrollTo(0, 0);
		});
	// }, false);
}]);

