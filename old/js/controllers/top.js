


app.controller('topCtrl', function($scope, $location, $route, Shops) {
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
		$route.reload();
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
		templateUrl: 'js/views/top.html'
	};
});