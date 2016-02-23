angular.module('resQ')

	.controller('MainCtrl', function($rootScope, $scope, $http, $timeout, $interval, $document, callAPI, $state, $location, $localStorage) {

		// Get breed list for search page
	    var breedParameters = {
			'apikey'       : 'YwusOunb', 
			'objectType'   : 'animalBreeds', 
			'objectAction' : 'publicList'
		},

		breedsTarget = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(breedParameters);

	    callAPI.getData(breedsTarget).success(function(response) { 
	    	$scope.breeds = response.data; 
	    });

	    // Go back to search or to dog list of saved
		$scope.goBack = function($timeout){
			if ($state.current.name == 'results.dog' && $rootScope.previousState.name) {
				$state.go($rootScope.previousState, $rootScope.previousStateParams);
			} else {
				$state.go('search');
				delete $localStorage.dogs;
			}
		}

		// Show list of breeds
		$scope.showList = function() {
			$('.breed-list').show();
		}

		// Hide list of breeds
		$scope.hideList = function() {
			$timeout(function(){
				$('.breed-list').hide();
			}, 100);
		}

		// Get user's breed selection for form input
		$scope.getBreed = function($event) {
			breedChoice = angular.element($event.currentTarget).text();
			$('input[name=breed]').val(breedChoice);
		}

	})