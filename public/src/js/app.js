(function() {

	var resQ = angular.module('resQ', ['ngAnimate', 'ngSanitize', 'ui.router', 'ngStorage'])

	.run( ['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	    $rootScope.$state = $state;
	    $rootScope.$stateParams = $stateParams;
	    $rootScope.keys = Object.keys; 

	    // Track current and previous states
	    $rootScope.previousState;
		$rootScope.currentState;

		$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
	        // Save the previous state in rootScope so that it's accessible from everywhere
	        $rootScope.previousState = from;
	        $rootScope.previousStateParams = fromParams;
	        console.log('fromParams: ' + $rootScope.previousStateParams)
	    });

	    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
	    	// Save the next pending state's parameters in rootScope so that it's accessible from everywhere
	        $rootScope.toParams = toParams;
	    });
	}])

	.config(function($stateProvider, $locationProvider){
		$stateProvider
		.state('home', {
			url: '/',
			views: {
				'content' : { templateUrl: 'src/templates/home/home.html' }
			}
		})
		.state('search', {
			url: '/search',
			views: {
				'content' : { 
					templateUrl: 'src/templates/search/search.html' ,
					controller: 'SearchCtrl'
				}
			}
		})
		.state('results', {
			url: '',
			views: {
				'content' : { 
					templateUrl: 'src/templates/results/results.html'
				},
				'results-content' : { 
					templateUrl: 'src/templates/results/loading/loading.html'
				}
			}
		})
		.state('results.loading', {
			url: '/results?range&zipcode&breed&age&gender',
			views: {
				'content' : { 
					templateUrl: 'src/templates/results/results.html'
				},
				'results-content' : { 
					templateUrl: 'src/templates/results/loading/loading.html',
					controller: 'LoadingCtrl'
				}
			}
		})
		.state('results.list', {
			url: '/results?range&zipcode&breed&age&gender', 
			views: {
				'content' : { 
					templateUrl: 'src/templates/results/results.html'
				},
				'results-content' : { 
					templateUrl: 'src/templates/results/list/list.html',
					controller: 'ResultsCtrl'
				}
			},
			resolve: {
	            dogResults: function (DogsService) {
			        return DogsService.getDogs();
			    }
			}
		})
		.state('results.dog', {
			url: '/dog?dogID',
			views: {
				'content' : { 
					templateUrl: 'src/templates/results/results.html'
				},
				'results-content' : { 
					templateUrl: 'src/templates/results/dog/dog.html',
					controller: 'DogCtrl'
				}
			},
			resolve: {
	            focusedDog: function (DogsService) {
			        return DogsService.getDog();
			    }
			}
		})
		.state('error', {
			url: '/error',
			views: {
				'content' : { templateUrl: 'error/error.html' }
			}
		})

		//$locationProvider.html5Mode(true);
    	//$locationProvider.hashPrefix('!');


	})

	.controller('SearchCtrl', function($scope, $state, $localStorage) {

		// Fire search functions
		$scope.searchInit = function() {

			// Reset localStorage
			delete $localStorage.dogs;

			// Collect form data
			$scope.user = {
				zipcode: $('input[name=zipcode]').val(), 
				range: $('select[name=range]').val(), 
				breed: $('input[name=breed]').val(),
				age: $('select[name=age]').val(),
				gender: $('select[name=gender]').val(),
			};

			$state.go('results.loading', {zipcode: $scope.user.zipcode, range: $scope.user.range, breed: $scope.user.breed, age: $scope.user.age, gender: $scope.user.gender})

		}

	})

	.controller('ResultsCtrl', function($scope, $state, $timeout, $interval, dogResults) {
		if (dogResults) {
			$scope.dogResults = dogResults;

			console.log(dogResults);

			$scope.getDog = function($event) {
				target = $event.currentTarget;
				$scope.dogID = $(target).attr('ng-class');

				$state.go('results.dog', {dogID: $scope.dogID})
			}
		}
	})

	.controller('LoadingCtrl', function($scope, $state, $location) {
		$state.go('results.list', {zipcode: $location.search().zipcode, range: $location.search().range, breed: $location.search().breed, age: $location.search().age, gender: $location.search().gender});
	})

	.controller('DogCtrl', function($scope, focusedDog) {
		$scope.focusedDog = focusedDog;
		console.log($scope.focusedDog)
	})

	.controller('MainCtrl', function($rootScope, $scope, $http, $timeout, $interval, $document, callAPI, $state, $location, $localStorage) {

	    var breedParameters = {
			'apikey'       : 'YwusOunb', 
			'objectType'   : 'animalBreeds', 
			'objectAction' : 'publicList'
		},

		breedsTarget = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(breedParameters);

	    callAPI.getData(breedsTarget).success(function(response) { 
	    	$scope.breeds = response.data; 
	    });

		$scope.goBack = function($timeout){
			if ($state.current.name == 'results.dog' && $rootScope.previousState.name) {
				$state.go($rootScope.previousState, $rootScope.previousStateParams);
			} else {
				$state.go('search');
				delete $localStorage.dogs;
			}
		}

		$scope.showList = function() {
			$('.breed-list').show();
		}

		$scope.hideList = function() {
			$timeout(function(){
				$('.breed-list').hide();
			}, 100);
		}

		$scope.getBreed = function() {
			breedChoice = angular.element(event.target).text();
			$('input[name=breed]').val(breedChoice);
		}

		// $scope.viewDog = function() {

		// 	dogTarget = angular.element($event.target);
		// 	$scope.dogID = dogTarget.attr('ng-class');

		// 	console.log('dogID: ' + dogTarget.attr('ng-class'));

		// 	$state.go('results.list.dog', {dogID: $scope.dogID});

		// }

		// Show dog details
		//$scope.expandDog = function() {
			//reset dog photo
			//currentPic = 0;
	   		//$state.go('results.list.dog', {dogID: $scope.focusedDog.animalID});
	   		// $('.img-wrap').isotope({
	   		// 	itemSelector: '.dog-img'
		    // });
		    // $('.img-wrap').isotope('layout');
		//}

		// Navigate through dog images
		$scope.changeImg = function() {
			var picTarget = angular.element(event.target),
				dogID = $(picTarget).siblings('.dog-img').attr('ng-class'),
				dogTarget = $('.dog-img[ng-class="' + dogID + '"]'),
				dogPics = $scope.dogs[dogID].animalPictures,
				totalPics = $scope.dogs[dogID].animalPictures.length;

			if (totalPics > 1) {
				if ($(picTarget).hasClass('next')) {
					if ( currentPic < (totalPics - 1) ) {
						currentPic++;
					} else {
						currentPic = 0;
					}
				} else if ($(picTarget).hasClass('prev')) {
					if ( currentPic == 0 ) {
						currentPic = (totalPics - 1);
					} else {
						currentPic--;
					}
				}

				$(dogTarget).attr('src', dogPics[currentPic].urlInsecureFullsize);

				$(dogTarget).imagesLoaded(function() {
					//$('#results-wrap').isotope('layout');
				});

			}
		}

	})

	// Wait until last ng-repeat to show results
	.directive('onLastRepeat', function($timeout, $interval) {
        return function($scope) {
            if ($scope.$last) {

                $('#results-wrap').imagesLoaded(function() {

                	$('#loading-wrap').fadeOut(400);

                	$timeout(function(){
	                	$('#results-wrap').fadeIn(500);
	                 	$interval.cancel(loadingDots);
                	}, 700);

                });
            }
        };
    })

	// Loading animation
    .directive('loadingAnimation', function($interval) {
    	return function($scope) {
    		dotNum = 0;

    		loadingDots = $interval(function(){
    			if (dotNum < 3) {
    				$('#loading-wrap h3 span').append('.');
    				dotNum++;
    			} else {
    				$('#loading-wrap h3 span').empty();
    				dotNum = 0;
    			}
    		}, 600);
    	}
    })

    // See if object is empty
	.filter('nonEmpty', function() {
		return function(object) {
			return !!(object && Object.keys(object).length > 0);
		};
	})

	// Covert object of objects to array of objects to allow filtering
    .filter('array', function() {
		return function(items) {
			var filtered = [];
				angular.forEach(items, function(item) {
				filtered.push(item);
			});
		return filtered;
		};
	})

    // Make calls to API and return data
	.factory('callAPI', function($http){
	    return {
	        getData: function(target) {
	            return $http.jsonp(target);
	        }
	    };
	})

    .service('DogsService', ['$http', '$location', '$stateParams', '$rootScope', '$localStorage', function($http, $location, $stateParams, $rootScope, $localStorage) {

    	return {
    		getDogs : function() {

    			// If user isn't navigating back from viewing dog, call API for new dog list
    			if (!$localStorage.dogs) {

    				if ($location.search().breed) {
		    			// Data to pass to API
						var dogsParameters = {
							'apikey'       : 'YwusOunb', 
							'objectType'   : 'animals', 
							'objectAction' : 'publicSearch',
							'search' : { 
								'resultStart'   : 0, 
								'resultLimit'   : 100,
								'resultSort'    : 'animalLocationDistance', 
								'calcFoundRows' : 'Yes',
								'fields' : [
									'animalUrl', 
									'animalName', 
									'animalBreed',
									'animalSex',
									'animalDescription',
									'animalPictures',
									'animalGeneralAge',
									'animalLocation',
									'animalLocationState'
								],
								'filters' : [
									{'fieldName'  : 'animalStatus', 
									'operation'   : 'equals', 
									'criteria'    : 'Available'},
									{'fieldName'  : 'animalSpecies', 
									'operation'   : 'equals', 
									'criteria'    : 'dog'},
									{'fieldName'  : 'animalLocationDistance', 
									'operation'   : 'radius', 
									'criteria'    :  $location.search().range },
									{'fieldName'  : 'animalLocation', 
									'operation'   : 'radius', 
									'criteria'    : $location.search().zipcode },
									{'fieldName'  : 'animalBreed', 
									'operation'   : 'equals', 
									'criteria'    : $location.search().breed },
									{'fieldName'  : 'animalSex', 
									'operation'   : 'equals', 
									'criteria'    : $location.search().gender },
									{'fieldName'  : 'animalGeneralAge', 
									'operation'   : 'equals', 
									'criteria'    : $location.search().age }
								]
							}
						}
					} else {
						// Data to pass to API
						var dogsParameters = {
							'apikey'       : 'YwusOunb', 
							'objectType'   : 'animals', 
							'objectAction' : 'publicSearch',
							'search' : { 
								'resultStart'   : 0, 
								'resultLimit'   : 100,
								'resultSort'    : 'animalLocationDistance', 
								'calcFoundRows' : 'Yes',
								'fields' : [
									'animalUrl', 
									'animalName', 
									'animalBreed',
									'animalSex',
									'animalDescription',
									'animalPictures',
									'animalGeneralAge',
									'animalLocation',
									'animalLocationState'
								],
								'filters' : [
									{'fieldName'  : 'animalStatus', 
									'operation'   : 'equals', 
									'criteria'    : 'Available'},
									{'fieldName'  : 'animalSpecies', 
									'operation'   : 'equals', 
									'criteria'    : 'dog'},
									{'fieldName'  : 'animalLocationDistance', 
									'operation'   : 'radius', 
									'criteria'    :  $location.search().range },
									{'fieldName'  : 'animalLocation', 
									'operation'   : 'radius', 
									'criteria'    : $location.search().zipcode },
									{'fieldName'  : 'animalSex', 
									'operation'   : 'equals', 
									'criteria'    : $location.search().gender },
									{'fieldName'  : 'animalGeneralAge', 
									'operation'   : 'equals', 
									'criteria'    : $location.search().age }
								]
							}
						}
					}

					var target = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(dogsParameters);

					return $http.jsonp(target)
					.then(function(response) {
						console.log(response.data.data);

						// Catch undefined response from API
						if (response.data.data) {
							$localStorage.dogs = response.data.data;
						} else {
							response.data.data = {};
						}

						// Let those dogs out
						return response.data.data;

				    }, function(response) {
				    	// Go to error page
				    	$state.go('error');
				    });

			    } else {
			    	// Return to stored dog list instead if it exists
			    	return $localStorage.dogs;
			    } 
    		},
    		getDog : function() {

    			// If accessing from saved url, get dog ID from query string
				if (!$rootScope.toParams.dogID) {
					$rootScope.dogID = $location.search().dogID;
				} else {
					$rootScope.dogID = $rootScope.toParams.dogID
				}

				var dogParameters = {
					'apikey'       : 'YwusOunb', 
					'objectType'   : 'animals', 
					'objectAction' : 'publicSearch',
					'search' : { 
						'resultStart'   : 0, 
						'resultLimit'   : 1,
						'fields' : [
							'animalUrl', 
							'animalName', 
							'animalBreed',
							'animalSex',
							'animalDescription',
							'animalPictures',
							'animalGeneralAge',
							'animalLocation',
							'animalLocationState'
						],
						'filters' : [
							{
								'fieldName'  : 'animalID', 
								'operation'  : 'equals', 
								'criteria'   : $rootScope.dogID
							}
						]
					}
				},

				target = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(dogParameters);

				return $http.jsonp(target)
					.then(function(response) {
						
						// Catch undefined response from API
						if (!response.data.data[$rootScope.dogID]) {
							response.data.data[$rootScope.dogID] = {};
						} 

						// Let that singular dog out
						return response.data.data[$rootScope.dogID];

				    }, function(response) {
				    	// Go to error page
				    	$state.go('error');
				    });
			},

			getOrg : function() {

				dogTarget = angular.element(event.target);

				// Data to receive about dog's organization
				var orgParameters = {
					'apikey'       : 'YwusOunb', 
					'objectType'   : 'orgs', 
					'objectAction' : 'publicSearch',
					'search' : { 
						'resultStart'   : 0, 
						'resultLimit'   : 1,
						'fields' : [
							'orgName',
							'orgAddress',
							'orgCity',
							'orgState',
							'orgPostalCode',
							'orgPhone',
							'orgEmail',
							'orgWebsiteUrl',
							'orgFacebookUrl'
						],
						'filters' : [
							{
								'fieldName'  : 'orgID', 
								'operation'  : 'equals', 
								'criteria'   : orgID
							}
						]
					}
				},

				target = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(orgParameters);

				return $http.jsonp(target)
					.then(function(response) {
						//console.log(response.data.data[orgID]);
						return response.data.data[orgID];
				    });

			}
		}
	}])

})();