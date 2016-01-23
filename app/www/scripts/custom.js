'use strict';
var ApplicationConfiguration = (function() {
    var applicationModuleName = 'angularjsapp';
    var applicationModuleVendorDependencies = [
        'ngResource',
        
        'ngCookies', 
        
        'ngAnimate', 
        
        'ngTouch', 
        
        'ngSanitize', 
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'LocalStorageModule',
        'chart.js'
    ];
    var registerModule = function(moduleName) {
        angular
            .module(moduleName, []);
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

var _txt = {};
_txt.Products = {en:'Products'};
_txt.Categories = {en:'Categories'};
_txt.Orders = {en:'Orders'};
_txt.Buyers = {en:'Buyers'};
_txt.Settings = {en:'Settings'};
_txt.Home = {en:'Home'};
_txt.setting_shops = {en:'Shops'};
_txt.setting_no_shops = {en:'- No shops yet -'};
_txt.setting_shop_url = {en:'Shop url'};
_txt.setting_shop_urlprotocol = {en:'Shop url protocol'};
_txt.setting_shop_name = {en:'Shop name'};
_txt.setting_shop_name_example = {en:'My eShop'};
_txt.setting_shop_behawk = {en:'Shop behawk file name (by default: behawk)'};
_txt.setting_shop_cms_type = {en:'CMS type'};
_txt.Save = {en:'Save'};
_txt.Add = {en:'Add'};
_txt.Add_shop = {en:'Add shop'};
_txt.Close = {en:'Close'};
_txt.Ok = {en:'Ok'};
_txt.Remove_question_title = {en:'<i class="icon-trash"></i> Remove?'};
_txt.Remove_question = {en:'Do you want to remove it?'};
_txt.stat_Incomes = {en:'Incomes'};
_txt.stat_Orders = {en:'Orders'};
_txt.Wrong_shop_url = {en:'Wrong shop url'};
_txt.Wrong_shop_url_text = {en:'Check your shop url in settings please'};

var lng = 'en';
'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });

'use strict';

ApplicationConfiguration.registerModule('core');


angular
    .module('core')
    .service('Shops', function($rootScope, $log, localStorageService) {
		var Shops = {};
		var ls = localStorageService;
		Shops.shops = angular.fromJson(ls.get('shops'))

		Shops.setShops = function(shops) {
			Shops.shops = shops;
			update();
		}

		function update() {
			ls.set('shops',angular.toJson(Shops.shops));
			$rootScope.$broadcast('updatedShops');
		}
		
		Shops.getShops = function() {
			return Shops.shops;
		}

		return Shops;
	})
	.controller('navCtrl', function($scope, $location, localStorageService, Shops) {
		var ls = localStorageService;
		$scope._txt = _txt;
		$scope.lng = lng;
		$scope.menu = [
			{
				name: 'Home',
				url: '#!/',
				icon: 'icon-home3'
			},
			{
				name: 'Orders',
				url: '#!/orders',
				icon: 'icon-clipboard'
			},
			{
				name: 'Buyers',
				url: '#!/buyers',
				icon: 'icon-address-book'
			},
			{
				name: 'Products',
				url: '#!/products',
				icon: 'icon-price-tags'
			},
			{
				name: 'Categories',
				url: '#!/categories',
				icon: 'icon-folder-open'
			},
			{
				name: 'Settings',
				url: '#!/settings',
				icon: 'icon-cog'
			}
		];

		$scope.isActiveLink = function(path) {
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
	}).directive('nav', function() {
		return {
			templateUrl: 'modules/core/views/nav.html'
		};
	})
    .controller('topCtrl', function($scope, $location, $state, Shops) {
        $scope._txt = _txt;
        $scope.lng = lng;



        $scope.shops = Shops.getShops();
        $scope.selected = {};
        for(var i in $scope.shops){
            if($scope.shops[i].selected==true){
                $scope.selected = $scope.shops[i];
            }
        }

        $scope.$on('updatedShops', function() {
            $scope.shops = Shops.getShops();
            for(var i in $scope.shops){
                if($scope.shops[i].selected==true){
                    $scope.selected = $scope.shops[i];
                }
            }
            $scope.selectedOption = $scope.selected;
        });
        $scope.selectedOption = $scope.selected;
        $scope.selectShop = function(){
            for(var i in $scope.shops){
                if($scope.shops[i].id==$scope.selectedOption.id){
                    $scope.shops[i].selected = true;
                }
                else{
                    $scope.shops[i].selected = false;
                }
            }
            $scope.$watch('shops', function() {
                Shops.setShops($scope.shops);
            });
            $state.go($state.current.name, {}, {reload: true})
        };

        $scope.menu = function(e){
            $('#wrap').addClass('sidebar-opened');
            $('#sidebar').animate({left:'0px'},250,function(){
                $('#sidebar a,#content').click(function(){
                    $('#sidebar').animate({left:'-200px'},250,function(){
                        $('#wrap').removeClass('sidebar-opened');
                    });
                });
            });
        };
    }).directive('top', function() {
        return {
            templateUrl: 'modules/core/views/top.html'
        };
    });

function getUrl(shops){
	var shop = {};
	for(var i in shops){
		if(shops[i].selected==true){
			shop = shops[i];
		}
	}
	var url = shop.url+'/';
	switch(shop.type){
		case '1':
		case '2':{
			var url = url+'index.php?tmpl='+shop.behawk;
			break;
		}
		case '3':{
			var url = url+'index.php?route=product/'+shop.behawk+'/get';
			break;
		}
	}
	return url;
}

function Alert(title,content) {
	if(title=='Wrong shop url'){
		window.location = '#!/settings'
	}
	else{
		var modal = $('<div />');
		var modalDialog = $('<div />');
		var modalContent = $('<div />');
		var modalHeader = $('<div />');
		var modalBody = $('<div />');
		var modalFooter = $('<div />');
		var close = $('<button />');
		var modalTitle = $('<h4 />');
		var closeModal = $('<button />');
		var submitModal = $('<button />');
		
		modal.addClass('modal');
		modalDialog.addClass('modal-dialog');
		modalContent.addClass('modal-content');
		modalHeader.addClass('modal-header');
		modalBody.addClass('modal-body');
		modalFooter.addClass('modal-footer');
		close.addClass('close');
		modalTitle.addClass('modal-title');
		closeModal.addClass('btn').addClass('btn-default');
		submitModal.addClass('btn').addClass('btn-primary');
		
		modalTitle.html(title);
		modalBody.html(content);
		close.attr({
			'type': 'button'
		}).html('<span aria-hidden="true">&times;</span>').click(function(){
			modal.remove();
		});
		closeModal.attr({
			'type': 'button'
		}).html(_txt['Close'][lng]).click(function(){
			modal.remove();
		});
		submitModal.attr({
			'type': 'button'
		}).html(_txt['Ok'][lng]);
		
		modalHeader.append(close).append(modalTitle);
		modalHeader.append(close).append(modalTitle);
		modalContent.append(modalHeader).append(modalBody);
		modalDialog.append(modalContent);
		modal.append(modalDialog);
		$('body').append(modal).ready(function(){
			modal.show();
		});
		return [submitModal,modal];
	}
}

function Dialog(title,content) {
	var modal = $('<div />');
	var modalDialog = $('<div />');
	var modalContent = $('<div />');
	var modalHeader = $('<div />');
	var modalBody = $('<div />');
	var modalFooter = $('<div />');
	var close = $('<button />');
	var modalTitle = $('<h4 />');
	var closeModal = $('<button />');
	var submitModal = $('<button />');
	
	modal.addClass('modal');
	modalDialog.addClass('modal-dialog');
	modalContent.addClass('modal-content');
	modalHeader.addClass('modal-header');
	modalBody.addClass('modal-body');
	modalFooter.addClass('modal-footer');
	close.addClass('close');
	modalTitle.addClass('modal-title');
	closeModal.addClass('btn').addClass('btn-default');
	submitModal.addClass('btn').addClass('btn-primary');
	
	modalTitle.html(title);
	modalBody.html(content);
	close.attr({
		'type': 'button'
	}).html('<span aria-hidden="true">&times;</span>').click(function(){
		modal.remove();
	});
	closeModal.attr({
		'type': 'button'
	}).html(_txt['Close'][lng]).click(function(){
		modal.remove();
	});
	submitModal.attr({
		'type': 'button'
	}).html(_txt['Ok'][lng]);
	
	modalHeader.append(close).append(modalTitle);
	modalHeader.append(close).append(modalTitle);
	modalFooter.append(closeModal).append(submitModal);
	modalContent.append(modalHeader).append(modalBody).append(modalFooter);
	modalDialog.append(modalContent);
	modal.append(modalDialog);
	$('body').append(modal).ready(function(){
		modal.show();
	});
	return [submitModal,modal];
}

function oSize(obj) {
  	var count = 0;
  	for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      	++count;
    	}
  	}
  	return count;
}

function GenId() {
	function id() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return id()+id();
}

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {
		xhr = null;

	}
	return xhr;
}


'use strict';

angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        '$compileProvider',
        function($stateProvider, $urlRouterProvider, $compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|content):/);
            $urlRouterProvider.otherwise('/');

                        $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'HomeCtrl'
                });
            $stateProvider
                .state('orders', {
                    url: '/orders',
                    templateUrl: 'modules/core/views/orders.html',
                    controller: 'OrdersCtrl'
                });
            $stateProvider
                .state('buyers', {
                    url: '/buyers',
                    templateUrl: 'modules/core/views/buyers.html',
                    controller: 'BuyersCtrl'
                });
            $stateProvider
                .state('products', {
                    url: '/products',
                    templateUrl: 'modules/core/views/products.html',
                    controller: 'ProductsCtrl'
                });
            $stateProvider
                .state('categories', {
                    url: '/categories',
                    templateUrl: 'modules/core/views/categories.html',
                    controller: 'CategoriesCtrl'
                });
            $stateProvider
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'modules/core/views/settings.html',
                    controller: 'SettingsCtrl'
                });
        }
    ]);

'use strict';


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
		$scope.buyers = result;
		start = start + 20;
		$scope.$apply();
	}).error(function(a,b,c){
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.loadMore = function(){
		$.ajax({
			url: url,
			data: {
				act: 'getBuyers',
				start: start
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(result){
			$scope.buyers = $.merge($scope.buyers,result);
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
		});
	};
	
	$scope.pageTitle = 'Buyers';
	$scope.pageTitleHead = 'Buyers - BEHAWK';
}]);
'use strict';

angular
    .module('core')
    .controller('CategoriesCtrl', ['$scope', 'localStorageService', 'Shops', function ($scope, localStorageService, Shops) {
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
		$scope.cats = result;
		$scope.$apply();
	}).error(function(a,b,c){
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.pageTitle = 'Categories';
	$scope.pageTitleHead = 'Categories - BEHAWK';
}]);

'use strict';

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
	$scope.data1 = [$scope.incomes[$scope.incomesYears[0]]['totals']];
	$scope.total =  $scope.incomes[$scope.incomesYears[0]]['total'];

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
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.selectIncomeYear = function(){
		$scope.data1 = [
			$scope.incomes[$scope.selectedYear]['totals']
		];
		$scope.total = $scope.incomes[$scope.selectedYear]['total'];
	};

	$scope.pageTitle = 'BEHAWK';
	$scope.pageTitleHead = 'BEHAWK';
}]);

'use strict';

'use strict';


angular
    .module('core')
	.controller('OrdersCtrl', ['$scope', 'localStorageService', 'Shops',function ($scope, localStorageService, Shops) {
	var ls = localStorageService;
	$scope._txt = _txt;
	$scope.lng = lng;
	$scope.shops = Shops.getShops();
	$scope.$on('updatedShops', function() {
		$scope.shops = Shops.getShops();
	});
	$scope.labels = {
		'P': "Pending",
		'U': "Confirmed by Shopper",
		'C': "Confirmed",
		'X': "Cancelled",
		'R': "Refunded",
		'S': "Shipped"
	};
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
		$scope.orders = result;
		start = start + 20;
		$scope.$apply();
	}).error(function(a,b,c){
		Alert(_txt['Wrong_shop_url'][lng],_txt['Wrong_shop_url_text'][lng]);
	});

	$scope.loadMore = function(){
		$.ajax({
			url: url,
			data: {
				act: 'getOrders',
				start: start
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(result){
			$scope.orders = $.merge($scope.orders,result);
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
		});
	};

	$scope.pageTitle = 'Orders';
	$scope.pageTitleHead = 'Orders - BEHAWK';
}]);
'use strict';

angular
    .module('core')
    .controller('ProductsCtrl', ['$scope', 'localStorageService', 'Shops', function ($scope, localStorageService, Shops) {
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
		$scope.prods = result;
		$scope.$apply();
		start = start + 20;
	}).error(function(a,b,c){
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
		$scope.cats = result;
		$scope.$apply();
	}).error(function(a,b,c){
	});

	$scope.filterByCat = function(){
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
			$scope.prods = result;
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
		});
	};

	$scope.loadMore = function(){
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
			$scope.prods = $.merge($scope.prods,result);
			start = start + 20;
			$scope.$apply();
		}).error(function(a,b,c){
		});
	};

	$scope.pageTitle = 'Products';
	$scope.pageTitleHead = 'Products - BEHAWK';
}]);
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
			{
				id: 3,
				name: 'OpenCart'
			}
		];

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
				if(oSize(shops) > 0){
					shops.push(newShop);
				}
				else{
					newShop.selected = true;
					shops = [newShop];
				}
				$scope.shops = shops;
				$scope.$watch('shops', function() {
					Shops.setShops($scope.shops);
				});
				$('#settingsForm')[0].reset();
			}
		};
	}]);
