


app.service('Shops', function($rootScope, $log, localStorageService) {
	var Shops = {};
	var ls = localStorageService;
	Shops.shops = angular.fromJson(ls.get('shops'))

	Shops.setShops = function(shops) {
		// console.info(shops);
		Shops.shops = shops;
		update();
	}

	function update() {
		ls.set('shops',angular.toJson(Shops.shops));
		// console.info(Shops.shops);
		$rootScope.$broadcast('updatedShops');
	}
	
	Shops.getShops = function() {
		return Shops.shops;
	}

	return Shops;
});