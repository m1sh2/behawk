


app.controller('SettingsCtrl', function ($scope, localStorageService, $route, Shops, $window) {
	var ls = localStorageService;
	var sets = this;
	sets.addFromShow = false;
	$scope._txt = _txt;
	$scope.lng = lng;
	sets.settingsForm = {};
	

	sets.default = function() {
		sets.settingsForm.url = '';
		sets.settingsForm.urltype = 'http://';
		sets.settingsForm.type = 1;
		sets.settingsForm.name = '';
		sets.settingsForm.behawk = 'behawk';
	}

	sets.default();

	$scope.settings = {
		'shops': angular.fromJson(ls.get('shops'))
	};

	$scope.shops = Shops.getShops();
	$scope.settings.shops = $scope.shops;
	$scope.$on('updatedShops', function() {
		$scope.shops = Shops.getShops();
		$scope.settings.shops = $scope.shops;
	});
	
	$scope.types = [
		{
			id: 1,
			name: 'Joomla+Virtuemart'
		},
		// {
		// 	id: 2,
		// 	name: 'Joomla+JoomShopping'
		// },
		{
			id: 3,
			name: 'OpenCart'
		}
	];

	// console.info($scope.settings);

	$scope.pageTitle = 'Settings';
	$scope.pageTitleHead = 'Settings - BEHAWK';
	$scope.downloadType = {};
	$scope.downloadType[1] = 'joomla-virtuemart';
	$scope.downloadType[2] = 'joomla-joomshopping';
	$scope.downloadType[3] = 'opencart';
	$scope.downloadUrl = 'https://www.datsko.it/en/behawk';
	$scope.behawk = 'behawk';

	sets.download = function(type){
		$window.open($scope.downloadUrl+'#'+$scope.downloadType[type]);
	};

	sets.remove = function(shop){
		var modal = Dialog(_txt['Remove_question_title'][lng],_txt['Remove_question'][lng]);
		modal[0].click(function(){
			$scope.shops.splice($scope.shops.indexOf(shop), 1);
			$scope.$watch('shops', function() {
				Shops.setShops($scope.shops);
			});
			$scope.$apply();
			modal[1].remove();
		});
	};

	sets.submit = function(){
		var error = false;
		$('#settingsForm [name="url"]').parent().removeClass('has-error');
		$('#settingsForm [name="urltype"]').parent().removeClass('has-error');
		$('#settingsForm [name="type"]').parent().removeClass('has-error');

		if(typeof $scope.settingsForm.url == 'undefined'){
			$('#settingsForm [name="url"]').parent().addClass('has-error');
			error = true;
		}
		if(typeof $scope.settingsForm.urltype == 'undefined'){
			$('#settingsForm [name="urltype"]').parent().addClass('has-error');
			error = true;
		}
		if(typeof $scope.settingsForm.type == 'undefined'){
			$('#settingsForm [name="type"]').parent().addClass('has-error');
			error = true;
		}
		if(typeof $scope.settingsForm.name == ''){
			$('#settingsForm [name="name"]').parent().addClass('has-error');
			error = true;
		}
		if(typeof $scope.settingsForm.behawk == ''){
			$('#settingsForm [name="behawk"]').parent().addClass('has-error');
			error = true;
		}

		if(!error){
			var shops = $scope.shops;
			var newShop = {
				id: GenId(),
				name: $scope.settingsForm.name,
				behawk: $scope.settingsForm.behawk,
				url: $scope.settingsForm.urltype + '' + $scope.settingsForm.url,
				type: $scope.settingsForm.type,
				selected: false
			};
			// console.info(oSize(shops));
			if(oSize(shops) > 0){
				shops.push(newShop);
			}
			else{
				newShop.selected = true;
				shops = [newShop];
			}
			// console.info(shops);
			$scope.shops = shops;
			$scope.$watch('shops', function() {
				Shops.setShops($scope.shops);
			});
			sets.default();
			sets.addFromShow = false;
		}
	};
})
.directive('settings', function() {
	return {
		templateUrl: 'views/settings.html'
	};
});