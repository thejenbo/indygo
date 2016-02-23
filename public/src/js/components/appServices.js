angular.module('resQ')

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
								'resultLimit'   : 70,
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
							'animalLocationState',
							'animalOrgID'
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

				dogTarget = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(dogParameters);

				return $http.jsonp(dogTarget)
					.then(function(response) {
						
						// Catch undefined response from API
						if (!response.data.data[$rootScope.dogID]) {
							response.data.data[$rootScope.dogID] = {};
						} 

						// Set organization ID
						$rootScope.orgID = response.data.data[$rootScope.dogID].animalOrgID;

						// Let that singular dog out
						return response.data.data[$rootScope.dogID];

				    }, function(response) {
				    	// Go to error page
				    	$state.go('error');
				    });
			},

			getOrg : function() {

				console.log('orgId: ' + $rootScope.orgID);

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
								'criteria'   : $rootScope.orgID
							}
						]
					}
				},

				orgTarget = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + angular.toJson(orgParameters);

				return $http.jsonp(orgTarget)
					.then(function(response) {
						
						// Catch undefined response from API
						if (!response.data.data[$rootScope.orgID]) {
							response.data.data[$rootScope.orgID] = {};
						} 

						// Let that singular org out
						return response.data.data[$rootScope.orgID];

				    }, function(response) {
				    	// Go to error page
				    	$state.go('error');
				    });

			}
		}
	}])