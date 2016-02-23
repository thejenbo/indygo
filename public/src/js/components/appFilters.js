angular.module('resQ')

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