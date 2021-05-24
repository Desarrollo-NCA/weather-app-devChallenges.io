    	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	};

	function success(pos) {
		var crd = pos.coords;


		const lat = crd.latitude
		const long = crd.longitude
		lattLong = lat+","+long
	}

	function error(err) {
		console.warn("ERROR(" + err.code + "): " + err.message);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);

