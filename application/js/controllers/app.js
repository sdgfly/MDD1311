//Placeholder file for the application controller
//App's main module with dependencies for UI-Router and FireBase
var EatInApp = angular.module('EatInApp', ["ui.router"]);
//Configures which states will activate which views and url's and what 
//their controllers will be.


EatInApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/search");
	$stateProvider
//	search state is default view
	.state('search', {
		url: '/search',
		templateUrl: 'views/search.html'
	})
// navigates to About view
	.state('about', {
		url: '/about',
		templateUrl: 'views/about.html'
	})
//	Results view is nested inside search view.
//  Controller makes call to Yummly API
	.state('search.results', {
		url: '/results',
		templateUrl: 'views/search.results.html',
		controller: function ($scope, $http) {
		 	//var for unique App ID
		 	$scope.appId = '4606347e';
		 	//var for unique API Key
		    $scope.apiKey = '2b0dc330fcebb3d65bdddc74aae878b3';
		    //array that will contain search results
		    $scope.results = [];
	     	//results returned will be JSONP format
	       	$http.jsonp('http://api.yummly.com/v1/api/recipes?_app_id=' + $scope.appId + '&_app_key=' + $scope.apiKey + '&q=' + $scope.keyword + '&allowedCuisine[]=cuisine^cuisine-' + $scope.cuisine.val('id') + '&excludedIngredient=' + $scope.exclude + '&requirePictures=true&callback=JSON_CALLBACK').
        	//if successful return, parse data
	        success(function(data) {
	        	//forEach loop runs through matches
	        	//push names to results array
	        	angular.forEach(data.matches, function(recipe, index) {
	        		$scope.results.push(recipe);
	    		});
	        }). // success
	    	error(function(error) {
				alert('Please check your search terms and try again')
			}); // error
		} 
	})
//  Details view replaces main search view
//  Another call is made to API	
	.state('details', {
		//unique recipe ID fetched from results of clicked item
		url: '/details/:id',
		templateUrl: 'views/details.html',
		controller: function ($scope, $http, $stateParams) {
			//includes recipe id in url parameters
			$scope.id = $stateParams.id;
			$scope.appId = '4606347e';
    		$scope.apiKey = '2b0dc330fcebb3d65bdddc74aae878b3';
	    	$http.jsonp('http://api.yummly.com/v1/api/recipe/' +$stateParams.id
	    	+ '?_app_id=' + $scope.appId + '&_app_key=' + $scope.apiKey + '&callback=JSON_CALLBACK').
	    	success(function(data) {
	    		$scope.details = data;
	    		console.log($scope.details);
	    	}). //success
	    	error(function(error) {
				alert('Recipe not found');
			}); // error
			
	   	}
	})



});