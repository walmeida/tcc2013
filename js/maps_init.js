	var start_point    = new google.maps.LatLng(-23.55853,-46.731440000000006);
	var end_point      = new google.maps.LatLng(-23.561490000000003,-46.72536);
	var lookat_point   = new google.maps.LatLng(-23.563562106636414,-46.727536069311554);
	var map, directions_renderer, directions_service, streetview_service, geocoder;
	var start_pin, end_pin, pivot_pin, camera_pin;
	var _elevation = 0;
	var _route_markers = [];

	function init() {

		/* Map */

		var mapOpt = { 
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: start_point,
			zoom: 15
		};

		map = new google.maps.Map(document.getElementById("map"), mapOpt);
		geocoder = new google.maps.Geocoder();

		var overlay = new google.maps.StreetViewCoverageLayer();
		overlay.setMap(map);

		directions_service = new google.maps.DirectionsService();
		directions_renderer = new google.maps.DirectionsRenderer({draggable:false, markerOptions:{visible: false}});
		directions_renderer.setMap(map);
		directions_renderer.setOptions({preserveViewport:true});

		camera_pin = new google.maps.Marker({
			position: start_point,
			map: map
		});

		start_pin = new google.maps.Marker({
			position: start_point,
			draggable: true,
			map: map
		});

		google.maps.event.addListener (start_pin, 'dragend', function (event) {
			snapToRoad(start_pin.getPosition(), function(result) {
				start_pin.setPosition(result);
				start_point = result;
				/*changeHash();*/
			});
		});

		end_pin = new google.maps.Marker({
			position: end_point,
			draggable: true,
			map: map
		});

		google.maps.event.addListener (end_pin, 'dragend', function (event) {
			snapToRoad(end_pin.getPosition(), function(result) {
				end_pin.setPosition(result);
				end_point = result;
				/*changeHash();*/
			});
		});

		pivot_pin = new google.maps.Marker({
			position: lookat_point,
			draggable: true,
			map: map
		});

		google.maps.event.addListener (pivot_pin, 'dragend', function (event) {
			hyperlapse.setLookat( pivot_pin.getPosition() );
			/*changeHash();*/
		});

	}

    function snapToRoad(point, callback) {
        var request = { origin: point, destination: point, travelMode: google.maps.TravelMode["DRIVING"] };
        directions_service.route(request, function(response, status) {
            if(status=="OK") callback(response.routes[0].overview_path[0]);
            else callback(null);
        });
    }

    function findAddress(address) {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                drop_pins();
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    function drop_pins() {
        var bounds = map.getBounds();
        var top_left = bounds.getNorthEast();
        var bot_right = bounds.getSouthWest();
        var hdif = Math.abs(top_left.lng() - bot_right.lng());
        var spacing = hdif/4;

        var center = map.getCenter();
        var c1 = new google.maps.LatLng(center.lat(), center.lng()-spacing);
        var c2 = new google.maps.LatLng(center.lat(), center.lng());
        var c3 = new google.maps.LatLng(center.lat(), center.lng()+spacing);

        //hyperlapse.lookat = c2;
        pivot_pin.setPosition(c2);

        snapToRoad(c1, function(result1) {
            start_pin.setPosition(result1);
            start_point = result1;

            snapToRoad(c3, function(result3) {
                end_pin.setPosition(result3);
                end_point = result3;
                //changeHash();
            });
        });
    }