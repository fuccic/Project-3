console.log("Test");

var markers = [];
var map;
var bounds = new google.maps.LatLngBounds();
var currentLocation = [];

$(function() {

	var $newLocation = $('#new-location');
	// console.log($newLocation);
	var $itineraryList = $('#itinerary-info');
	// console.log($itineraryList);
	var $dummyButton = $('#dummy-button');
	// console.log($dummyButton);
	var $cityButton = $('#city-button');
	console.log($cityButton);

	$dummyButton.click(function() {
		console.log("Save location to Mongo");

	});

	$cityButton.click(function() {
		console.log("Save map to Mongo");
		createMap();
		
	});

	function initMap() {
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 0, lng: 0},
	    zoom: 1
	  });
	 
	  var input = document.getElementById('pac-input');
	  // var types = document.getElementById('type-selector');
	  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

	  var autocomplete = new google.maps.places.Autocomplete(input);
	  autocomplete.bindTo('bounds', map);

	  var infowindow = new google.maps.InfoWindow();
	  
	  var marker = new google.maps.Marker({
	    map: map,
	    anchorPoint: new google.maps.Point(0, -29)
	  });

	// var searchFunction = function(){
	  autocomplete.addListener('place_changed', function() {
	    infowindow.close();
	    marker.setVisible(false);
	    var place = autocomplete.getPlace();
	    currentLocation.push(place);
	    $addLocation = $('<li>');
	    $addLocation.html(place.name);
	    $itineraryList.append($addLocation);


	     // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          // map.setZoom(6);  // Why 17? Because it looks good.
        }

        //This code determines the attributes for the marker
	    // marker.setIcon(({
	      // url: place.icon,
	      // size: new google.maps.Size(90, 90),
	      // icon: "http://bit.ly/1T3NV7i",
	      // origin: new google.maps.Point(0, 0),
	      // anchor: new google.maps.Point(17, 34),
	      // scaledSize: new google.maps.Size(35, 35)
	    // }));


	    marker.setPosition(place.geometry.location);
	    marker.setVisible(true);


	    // var address = '';

	    // console.log(place.address_components);

	    //This contains the data to formate the address in the window that appears when you click the marker
	    // if (place.address_components) {
	    //   address = [
	    //     (place.address_components[0] && place.address_components[0].short_name || ''),
	    //     (place.address_components[1] && place.address_components[1].short_name || ''),
	    //     (place.address_components[2] && place.address_components[2].short_name || '')
	    //   ].join(' ');
	    // }

	    //This displays the infowindow
	    // infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
	    infowindow.open(map, marker);
	  });

	// }

				// console.log('this is ' + place);

	//   var createMap= function() {
	// 		console.log('ajax to create map');
	// 		var mapData = {
	// 			locations: place
	// 		}
	// 		$.ajax({
	// 			url: "http://localhost:3000/",
	// 			method: "POST",
	// 			data: mapData
	// 		}).done();
	//   }	
	}

	initMap();
	console.log(currentLocation);

});






