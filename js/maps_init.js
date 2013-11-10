	var start_point    = new google.maps.LatLng(-23.55853,-46.731440000000006);
	var end_point      = new google.maps.LatLng(-23.561490000000003,-46.72536);
	var lookat_point   = new google.maps.LatLng(-23.563562106636414,-46.727536069311554);
	var map, directions_renderer, directions_service, streetview_service, geocoder;
	var start_pin, end_pin, pivot_pin, camera_pin;
	var _elevation = 0;
	var _route_markers = [];
    var hyperlapse;

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
			map: map,
            visible: false
		});

		google.maps.event.addListener (pivot_pin, 'dragend', function (event) {
			hyperlapse.setLookat( pivot_pin.getPosition() );
			changeHash();
		});

        /* Hyperlapse */

        var pano = document.getElementById('pano');
        var is_moving = false;
        var px, py;
        var onPointerDownPointerX=0, onPointerDownPointerY=0;

        hyperlapse = new Hyperlapse(pano, {
            lookat: lookat_point,
            fov: 80,
            millis: 250,
            width: 400,
            height: 300,
            zoom: 2,
            use_lookat: false,
            distance_between_points: 5,
            max_points: 100,
            elevation: _elevation
        });
        
        

        hyperlapse.onError = function(e) {
            console.log( "ERROR: "+ e.message );
        };

        hyperlapse.onRouteProgress = function(e) {
            _route_markers.push( new google.maps.Marker({
                position: e.point.location,
                draggable: false,
                icon: "img/dot_marker.png",
                map: map
                })
            );
        };

        hyperlapse.onRouteComplete = function(e) {
            directions_renderer.setDirections(e.response);
            console.log( "Number of Points: "+ hyperlapse.length() );
            hyperlapse.load();
        };

        hyperlapse.onLoadProgress = function(e) {
            console.log( "Loading: "+ (e.position+1) +" of "+ hyperlapse.length() );
        };

        hyperlapse.onLoadComplete = function(e) {
            hyperlapse.position.x = -90;
            hyperlapse.play();
        };

        hyperlapse.onFrame = function(e) {
            console.log( "" +
                "Start: " + start_pin.getPosition().toString() + 
                "<br>End: " + end_pin.getPosition().toString() + 
                "<br>Lookat: " + pivot_pin.getPosition().toString() + 
                "<br>Position: "+ (e.position+1) +" of "+ hyperlapse.length() );
            camera_pin.setPosition(e.point.location);
        };

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

        hyperlapse.lookat = c2;
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

    function generate(){
        console.log( "Generating route..." );

        directions_renderer.setDirections({routes: []});

        var marker;
        while(_route_markers.length > 0) {
            marker = _route_markers.pop();
            marker.setMap(null);
        }

        request = {
            origin: start_point, 
            destination: end_point, 
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directions_service.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {   
                hyperlapse.generate({route: response});
            } else {
                console.log(status);
            }
        })
    }

    function updateHeadingValue(value){
        hyperlapse.position.x = value;
    }

    function updatePositionYValue(value){
        hyperlapse.position.y = value;
    }

    function updateFovValue(value){
        hyperlapse.setFOV(value);
    }

    function updateIntervalValue(value){
        hyperlapse.millis = value;
    }

    function playCanvasAnim(){
        hyperlapse.play();
    }

    function pauseCanvasAnim(){
        hyperlapse.pause();
    }

    function prevCanvasAnim(){
        hyperlapse.prev();
    }

    function nextCanvasAnim(){
        hyperlapse.next();
    }

    function obterImagens(){
        hyperlapse.pause();
        var img = $('<img id="resultadoA" />');
        var canvas = $('#pano').find('canvas')[0];
        var dataURL = canvas.toDataURL();
        img.attr('src', dataURL);
        img.appendTo('#divImagens');
        /*for (var i = 0; i < hyperlapse.length(); i++) {
                hyperlapse.setFrameByIndex(i);           
                var img = $('<img id="resultado' +i+ '" />');
                var canvas = $('#pano').find('canvas')[0];
                var dataURL = canvas.toDataURL();
                img.attr('src', dataURL);
                img.appendTo('#divImagens');
        }*/
    }

    