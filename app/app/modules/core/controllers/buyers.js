'use strict';


/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('BuyersCtrl', ['$scope', 'localStorageService', 'Shops',function ($scope, localStorageService, Shops) {
	var ls = localStorageService;
	$scope._txt = _txt;
	$scope.lng = lng;
	$scope.shops = Shops.getShops();
	$scope.$on('updatedShops', function() {
		$scope.shops = Shops.getShops();
	});
	var url = getUrl($scope.shops);
	var start = 0;

	$.ajax({
		url: url,
		data: {
			act: 'getBuyers',
			start: start
		},
		type: 'POST',
		dataType: 'json'
	}).done(function(result){
		// console.info(Object.keys(result).length);
		// console.info(result);
		$scope.buyers = result;
		start = start + 20;
		$scope.$apply();
	}).error(function(a,b,c){
		// console.error(a,b,c);
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.loadMore = function(){
		// console.info('Loading');
		$.ajax({
			url: url,
			data: {
				act: 'getBuyers',
				start: start
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(result){
			// console.info('Loaded',result);
			$scope.buyers = $.merge($scope.buyers,result);
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
			// console.error(a,b,c);
		});
	};
	
	$scope.pageTitle = 'Buyers';
	$scope.pageTitleHead = 'Buyers - BEHAWK';
}]);