angular.module('resQ')

	.controller('ResultsCtrl', function($scope, $state, $timeout, $interval, dogResults) {
		// Cancel loader interval
		$interval.cancel(loadingDots);
		
		if (dogResults) {
			$scope.dogResults = dogResults;

			// Go to dog's profile on click
			$scope.getDog = function($event) {
				target = $event.currentTarget;
				$scope.dogID = $(target).attr('ng-class');

				$state.go('results.dog', {dogID: $scope.dogID});
			}
		}
	})