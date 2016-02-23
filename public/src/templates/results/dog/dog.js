angular.module('resQ')

	.controller('DogCtrl', function($scope, focusedDog, focusedOrg) {
		// Bind org and dog objects to scope
		$scope.focusedDog = focusedDog;
		$scope.focusedOrg = focusedOrg;
	})