


app.filter('getById', function() {
	return function(input, id) {
		var i=0, len=input.length;
		for (; i<len; i++) {
			if (+input[i].id == +id) {
				return input[i];
			}
		}
		return null;
	}
});


app.controller('mainCtrl', function($scope, $location, $route, Shops, $timeout) {
	var main = this;
	
  	$scope.$on('$viewContentLoaded', function(event) {
      	$timeout(function() {
        	main.loaded = true;
      	},1000);
    });
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

