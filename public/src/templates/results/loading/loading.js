angular.module('resQ')

	.controller('LoadingCtrl', function($scope, $state, $location) {
		// Go straight to results page
		$state.go('results.list', {zipcode: $location.search().zipcode, range: $location.search().range, breed: $location.search().breed, age: $location.search().age, gender: $location.search().gender});
	})