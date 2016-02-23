angular.module('resQ')

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

			// Go to results
			$state.go('results.loading', {zipcode: $scope.user.zipcode, range: $scope.user.range, breed: $scope.user.breed, age: $scope.user.age, gender: $scope.user.gender})

		}

	})