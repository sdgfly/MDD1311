//App's main module with dependencies for UI-Router
var FoodApp = angular.module('FoodApp', ["ui.router"]);
//Configures which states will activate which views and url's and what 
//their controllers will be.



FoodApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/search");
	$stateProvider
//	search state is default view
	.state('search', {
		url: '/search',
		templateUrl: 'views/search.html',
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
		 	$scope.appId = 'a4d85a57';
		 	//var for unique API Key
		    $scope.apiKey = '4dda81acc7ebb71956fe76c76f0ec363';
		    //array that will contain search results
		    $scope.results = [];
	     	//results returned will be JSONP format
	       	$http.jsonp('http://api.yummly.com/v1/api/recipes?_app_id=' + $scope.appId + '&_app_key=' + $scope.apiKey + '&allowedCuisine[]=cuisine^cuisine-' + $scope.cuisine + '&requirePictures=true&callback=JSON_CALLBACK').
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
			$scope.appId = 'a4d85a57';
    		$scope.apiKey = '4dda81acc7ebb71956fe76c76f0ec363';
	    	$http.jsonp('http://api.yummly.com/v1/api/recipe/' +$stateParams.id
	    	+ '?_app_id=' + $scope.appId + '&_app_key=' + $scope.apiKey + '&callback=JSON_CALLBACK').
	    	success(function(data) {
	    		$scope.details = data;

	    	}). //success
	    	error(function(error) {
				alert('Recipe not found');
			}); // error
			
	   	}
	})



});