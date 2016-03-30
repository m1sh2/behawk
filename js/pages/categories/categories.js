



app.controller('CategoriesCtrl', function ($scope, localStorageService, Shops) {
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
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.pageTitle = 'Categories';
	$scope.pageTitleHead = 'Categories - BEHAWK';
});