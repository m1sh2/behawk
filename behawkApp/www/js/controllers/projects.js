'use strict';

app.controller('ProjectsController', function ($scope, $timeout) {
    $scope.data = { 
	    projects: [],
	    total: 0
	  }

	  // var query = parseQuery.new('Project').limit(10);
	  // query.descending('created');
	    
   //  parseQuery.find(query)
   //  .then(function(results) {
   //    $scope.data.projects = results;
   //    console.info(results);
   //    // nested promise :)
   //    return parseQuery.count(query);
   //  })
   // 	.then(function(total) {
   //    $scope.data.total = total;
   //  }, function(error) {
   //    alert(JSON.stringify(error));
   //  });

    $scope.pageTitle = 'Projects';
    $scope.pageTitleHead = 'Projects - DP - Control System - Datsko IT';
  });
