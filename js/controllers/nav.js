



app.controller('navCtrl', function($scope, $location, localStorageService, Shops) {
	var ls = localStorageService;
	var nav = this;
	$scope._txt = _txt;
	$scope.lng = lng;
	$scope.menu = [
		{
			name: 'Home',
			url: '/',
			icon: 'icon-home3'
		},
		{
			name: 'Orders',
			url: '/orders',
			icon: 'icon-clipboard'
		},
		{
			name: 'Buyers',
			url: '/buyers',
			icon: 'icon-address-book'
		},
		{
			name: 'Products',
			url: '/products',
			icon: 'icon-price-tags'
		},
		{
			name: 'Categories',
			url: '/categories',
			icon: 'icon-folder-open'
		},
		{
			name: 'Settings',
			url: '/settings',
			icon: 'icon-cog'
		}
	];

	$scope.isActiveLink = function(path) {
		// console.info(path,$location.path());
		if ($location.path() == path) {
			return true
		} else {
			return false
		}
	}

	$scope.shops = Shops.getShops();
	$scope.$on('updatedShops', function() {
		$scope.shops = Shops.getShops();
	});
	nav.opened = false;
}).directive('nav', function() {
	return {
		templateUrl: 'js/views/nav.html'
	};
});