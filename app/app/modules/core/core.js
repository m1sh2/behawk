'use strict';

/**
 * @ngdoc overview
 * @name core
 * @description The angular services, filters, directives, filters within the core module are accessible throughout the angular app like any other provider within the app, but these providers do not necessarily belong to any particular module, hence their placement would be here.
 */
ApplicationConfiguration.registerModule('core');


angular
    .module('core')
    .service('Shops', function($rootScope, $log, localStorageService) {
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
            // console.info($scope.shops);
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
            // $router.reload();
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
		// modalFooter.append(closeModal).append(submitModal);
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
	// console.info('Init CORS');
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {

		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest != "undefined") {

		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {

		// Otherwise, CORS is not supported by the browser.
		xhr = null;

	}
	// console.info(xhr);
	return xhr;
}

