'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeCtrl', ['$scope', 'localStorageService', 'Shops', function ($scope, localStorageService, Shops) {
	var ls = localStorageService;
	$scope._txt = _txt;
	$scope.lng = lng;
	$scope.title_Incomes = $scope._txt['stat_Incomes'][$scope.lng];
	$scope.title_Orders = $scope._txt['stat_Orders'][$scope.lng];
	$scope.shops = Shops.getShops();
	$scope.$on('updatedShops', function() {
		$scope.shops = Shops.getShops();
	});
	var url = getUrl($scope.shops);
	var year = new Date().getFullYear();

	$scope.incomesYears = [year,year-1];
	$scope.selectedYear = $scope.incomesYears[0];
	$scope.incomes = [];
	$scope.incomes[year-1] = [];
	$scope.incomes[year-1]['totals'] = [100,20,30,50,80,120,200,130,150,180,150,130];
	$scope.incomes[year-1]['months'] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$scope.incomes[year-1]['total'] = 'DEMO $1 510';
	$scope.incomes[year] = [];
	$scope.incomes[year]['totals'] = [100,250,230,150,180,120,200,300,50,80,150,300];
	$scope.incomes[year]['months'] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$scope.incomes[year]['total'] = 'DEMO $2 110';
	$scope.labels1 = $scope.incomes[$scope.incomesYears[0]]['months'];
	// $scope.series1 = ['Series A', 'Series B'];
	$scope.data1 = [$scope.incomes[$scope.incomesYears[0]]['totals']];
	$scope.total =  $scope.incomes[$scope.incomesYears[0]]['total'];
	// $scope.onClick = function (points, evt) {
	// 	console.log(points, evt);
	// };

	$scope.labels = {
		'P': "Pending",
		'U': "Confirmed by Shopper",
		'C': "Confirmed",
		'X': "Cancelled",
		'R': "Refunded",
		'S': "Shipped"
	};
	$scope.labels2 = ["Pending", "Confirmed by Shopper", "Confirmed", "Cancelled", "Refunded", "Shipped"];
	$scope.data2 = [1, 1, 1, 1, 1, 1, 1];

	$.ajax({
		url: url,
		data: {
			act: 'getStats'
		},
		type: 'POST',
		dataType: 'json'
	}).done(function(result){
		$scope.incomes = result.incomes;
		$scope.incomesYears = result.incomesYears;
		$scope.selectedYear = $scope.incomesYears[0];
		$scope.data1 = [$scope.incomes[$scope.incomesYears[0]]['totals']];
		$scope.total = $scope.incomes[$scope.incomesYears[0]]['total'];
		$scope.labels1 = $scope.incomes[$scope.incomesYears[0]]['months'];

		$scope.labels2 = [];
		for (var i = 0;i<result.orders.labels.length; i++) {
			$scope.labels2.push($scope.labels[result.orders.labels[i]]);
		};
		
		$scope.data2 = result.orders.data;
		
		$scope.$apply();
	}).error(function(a,b,c){
		// console.error(a,b,c);
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.selectIncomeYear = function(){
		// console.info($scope.selectedYear);
		$scope.data1 = [
			$scope.incomes[$scope.selectedYear]['totals']
		];
		$scope.total = $scope.incomes[$scope.selectedYear]['total'];
	};

	$scope.pageTitle = 'BEHAWK';
	$scope.pageTitleHead = 'BEHAWK';
}]);
