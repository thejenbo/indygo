angular.module('resQ')

	// Wait until last ng-repeat to show results
	.directive('onLastRepeat', function($timeout, $interval) {
        return function($scope) {
            if ($scope.$last) {

                $('#results-wrap').imagesLoaded(function() {
        			$timeout(function(){
	                	$('#results-wrap').fadeIn(500);
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