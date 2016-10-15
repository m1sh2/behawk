


app.controller('OrdersCtrl', function ($scope, localStorageService, Shops) {
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
			act: 'getOrders',
			start: start
		},
		type: 'POST',
		dataType: 'json'
	}).done(function(result){
		// console.info(Object.keys(result).length);
		// console.info(result.length);
		$scope.orders = result;
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
				act: 'getOrders',
				start: start
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(result){
			// console.info('Loaded',result);
			$scope.orders = $.merge($scope.orders,result);
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
			// console.error(a,b,c);
		});
	};

	$scope.pageTitle = 'Orders';
	$scope.pageTitleHead = 'Orders - BEHAWK';
});