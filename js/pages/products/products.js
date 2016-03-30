



app.controller('ProductsCtrl', function ($scope, localStorageService, Shops) {
	var ls = localStorageService;
	$scope._txt = _txt;
	$scope.lng = lng;
	$scope.prods = [];
	$scope.cats = [];
	$scope.shops = Shops.getShops();
	$scope.$on('updatedShops', function() {
		$scope.shops = Shops.getShops();
	});
	var url = getUrl($scope.shops);
	var start = 0;
	// console.info(url);
	$.ajax({
		url: url,
		data: {
			act: 'getProducts',
			cat: $scope.catId,
			start: start
		},
		type: 'POST',
		dataType: 'json'
	}).done(function(result){
		// console.info(result);
		$scope.prods = result;
		$scope.$apply();
		start = start + 20;
	}).error(function(a,b,c){
		// console.error(a,b,c);
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$.ajax({
		url: url,
		data: {
			act: 'getCategories'
		},
		type: 'POST',
		dataType: 'json'
	}).done(function(result){
		// console.info(result);
		$scope.cats = result;
		$scope.$apply();
	}).error(function(a,b,c){
		// console.error(a,b,c);
	});

	$scope.filterByCat = function(){
		// console.info('Loading',$scope.catId);
		start = 0;
		$.ajax({
			url: url,
			data: {
				act: 'getProducts',
				cat: $scope.catId,
				start: start
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(result){
			// console.info('Loaded',result);
			$scope.prods = result;
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
			// console.error(a,b,c);
		});
	};

	$scope.loadMore = function(){
		// console.info('Loading');
		$.ajax({
			url: url,
			data: {
				act: 'getProducts',
				cat: $scope.catId,
				start: start
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(result){
			// console.info('Loaded',result);
			$scope.prods = $.merge($scope.prods,result);
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
			// console.error(a,b,c);
		});
	};

	$scope.pageTitle = 'Products';
	$scope.pageTitleHead = 'Products - BEHAWK';
});


