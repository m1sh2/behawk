'use strict';


angular
    .module('core')
    .controller('SettingsCtrl', ['$scope', 'localStorageService', '$urlRouter', 'Shops', '$window', function ($scope, localStorageService, $urlRouter, Shops, $window) {
		var ls = localStorageService;
		$scope._txt = _txt;
		$scope.lng = lng;
		$scope.settingsForm = {};
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

		$scope.download = function(type){
			$window.open($scope.downloadUrl+'#'+$scope.downloadType[type]);
		};

		$scope.remove = function(shop){
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

		$scope.submit = function(){
			var error = false;
			$('#settingsForm [name="url"]').parent().removeClass('has-error');
			$('#settingsForm [name="urltype"]').parent().removeClass('has-error');
			$('#settingsForm [name="type"]').parent().removeClass('has-error');

			if(typeof $scope.settingsForm['url'].$viewValue == 'undefined'){
				$('#settingsForm [name="url"]').parent().addClass('has-error');
				error = true;
			}
			if(typeof $scope.settingsForm['urltype'].$viewValue == 'undefined'){
				$('#settingsForm [name="urltype"]').parent().addClass('has-error');
				error = true;
			}
			if(typeof $scope.settingsForm['type'].$viewValue == 'undefined'){
				$('#settingsForm [name="type"]').parent().addClass('has-error');
				error = true;
			}
			if(typeof $scope.settingsForm['name'].$viewValue == 'undefined'){
				$scope.settingsForm['name'].$viewValue = '';
			}
			if(typeof $scope.settingsForm['behawk'].$viewValue == 'undefined'){
				$scope.settingsForm['behawk'].$viewValue = '';
			}

			if(!error){
				var shops = $scope.shops;
				var newShop = {
					id: GenId(),
					name: $scope.settingsForm['name'].$viewValue,
					behawk: $scope.settingsForm['behawk'].$viewValue,
					url: $scope.settingsForm['urltype'].$viewValue+''+$scope.settingsForm['url'].$viewValue,
					type: $scope.settingsForm['type'].$viewValue,
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
				$('#settingsForm')[0].reset();
			}
		};
	}]);
