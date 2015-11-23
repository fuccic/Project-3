console.log("Test");

var markers = [];
var map;
var bounds = new google.maps.LatLngBounds();


$(function() {

	var $newLocation = $('#new-location');
	// console.log($newLocation);
	var $itineraryList = $('#itinerary-info');
	// console.log($itineraryList);

	function initMap() {
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: -33.8688, lng: 151.2195},
	    zoom: 12,
	  });
	 
	  var input = document.getElementById('pac-input');
	  var types = document.getElementById('type-selector');
	  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

	  var autocomplete = new google.maps.places.Autocomplete(input);
	  autocomplete.bindTo('bounds', map);

	  var infowindow = new google.maps.InfoWindow();
	  
	  var marker = new google.maps.Marker({
	    map: map,
	    anchorPoint: new google.maps.Point(0, -29)
	  });

	  autocomplete.addListener('place_changed', function() {
	    infowindow.close();
	    marker.setVisible(false);
	    var place = autocomplete.getPlace();
	    	// markers.push(place.id);
	    	// setMarker();
	    	// map.fitBounds(bounds);
	    $addLocation = $('<li>');
	    $addLocation.html(place.name);
	    $itineraryList.append($addLocation);
	    markers.push(place);
	    console.log(place);
	    console.log(place.id);
	    console.log(markers);

        //This code determines the attributes for the marker
	    marker.setIcon(({
	      // url: place.icon,
	      size: new google.maps.Size(71, 71),
	      icon: "http://bit.ly/1T3NV7i",
	      origin: new google.maps.Point(0, 0),
	      anchor: new google.maps.Point(17, 34),
	      scaledSize: new google.maps.Size(35, 35)
	    }));

	    marker.setPosition(place.geometry.location);
	    marker.setVisible(true);

	    var address = '';

	    // console.log(place.address_components);

	    // if (place.address_components) {
	    //   address = [
	    //     (place.address_components[0] && place.address_components[0].short_name || ''),
	    //     (place.address_components[1] && place.address_components[1].short_name || ''),
	    //     (place.address_components[2] && place.address_components[2].short_name || '')
	    //   ].join(' ');
	    // }

	    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
	    infowindow.open(map, marker);
	  });
	}
	initMap();
});

 var newMarker = function(){
	for(var i = 0; i < markers.length; i++){
		console.log(markers[i].id)
		// var position = new google.maps.LatLng(markers[i].getPosition());
		// console.log(position);
		// bounds.extend(position);	
    	var nextMarker = new google.maps.Marker({
	    	map: map,
	    	place: {
	    		placeId: markers[i].place_id,
	        	location: markers[i].geometry.location
	      	}
 		});
 		// nextMarker.setPosition(markers[i].geometry.location);
		// nextMarker.setVisible(true);
	}	
}



