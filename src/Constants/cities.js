export const getCities = (url) => {
	const cities = {};

	return fetch(url+'from-locations')
		.then(res => res.json())
		.then(res => {

			// Alphabetics cities
			res.sort(function(a, b){
				return a.cityName.localeCompare(b.cityName);
			})

			res.forEach(d => {

				// If not valid city name, skip it
				if ( d.countryName === null || !isNaN(d.cityName) || d.cityName === '#501' || d.cityName === 'United States' )
					return

				if (cities[d.countryName]) {
					cities[d.countryName].push({
						name: d.cityName,
						id: d._id,
					})
				} else {
					cities[d.countryName] = [{
						name: d.cityName,
						id: d._id,
					}]
				}

			});

			// Map into country objects and sort alphabetically
			var countries = Object.keys(cities).map(d => ({
				name: d,
				values: cities[d]
			})).sort(function(a, b){
				return a.name.localeCompare(b.name);
			})

			// Move US to the front
			/*countries.forEach(function(countryObject, index) {
				if (countryObject.name == 'United States') {
					arraymove(countries, index, 0)
				}
			})*/

			return countries
		})

	function arraymove(arr, fromIndex, toIndex) {
	    var element = arr[fromIndex];
	    arr.splice(fromIndex, 1);
	    arr.splice(toIndex, 0, element);
	}

};
