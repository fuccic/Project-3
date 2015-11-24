console.log("Test");

var user = null;

// var map;
// var bounds = new google.maps.LatLngBounds();
var currentLocation;

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
	    currentLocation = place;
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
	    infowindow.setContent('<div><strong>' + place.name + '</strong><br>');
	    infowindow.open(map, marker);
	  });

	// }

				// console.log('this is ' + place);

	}

  var createMap = function() {
  	var name = currentLocation.name;
  	var lat = currentLocation.geometry.location.lat();
  	var lng = currentLocation.geometry.location.lng();
  	var address = currentLocation.formatted_address;
  	var phoneNumber = currentLocation.formatted_phone_number;
		var website = currentLocation.website;
		var placeId = currentLocation.place_id;
		console.log('ajax to create map');
		var mapData = {
			name: name,
			address: address,
			lat: lat,
			lng: lng,
			phone: phoneNumber,
			website: website,
			place_id: placeId 
		}
		$.ajax({
			url: "http://localhost:3000/maps",
			method: "POST",
			data: mapData
		}).done();
 
  }	

	initMap();



	var $signupButton = $('#signup-button');

	$signupButton.click(function(){
		console.log("sdoufjha");
		signUpForm();
	});

	var $signinButton = $('#signin-button');

	$signinButton.click(function(){
		console.log("yoyoyo");
		showSignIn();
	});

});

	var getLocation = function() {
		console.log('before ajax');
		$.ajax({
			url: 'http://localhost:3000/maps/5653a5bed8166ca786af8ade',
			method: 'GET',
			dataType: 'json'
		}).done(renderMarkers);
	};

	var renderMarkers = function(data) {
		 var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        // maxZoom: 2,
        // minZoom: 2,
        // streetViewControl: false,
        draggable: true,
        // mapTypeControl: false,
        center: new google.maps.LatLng(31.639215, -7.982481),
        // mapTypeId: google.maps.MapTypeId.ROADMAP
    });

		for(var i=0;i<data.locations.length;i++) {
			var marker = new google.maps.Marker ({
		        position: {lat: data.locations[i].lat, lng: data.locations[i].lng},
		        map: map,
		        title: "Maps are cool"
    		});
		}
	};
	

	var signUpForm = function(){
		var formDiv = $('#form-container');
		$('#signup-button').remove();
		$('#signin-button').remove();
		var source = $('#user-signup-template').html();
		var template = Handlebars.compile(source);
		formDiv.append(template());
		$('#new-user-submit').click(function(){
			console.log('no secrets')

			createUser();
		});
	};

	var createUser = function(){
		var formDiv = $('#form-container');
		var username = $('#username-field').val();
		var password = $('#password-field').val();
		var userData = {
			username: username,
			password_hash: password
		};
		$.ajax({
			url: "http://localhost:3000/users",
			method: "POST",
			data: userData
		}).done(userShow())
	};

	var userShow = function(data){
		var frontPage = $("#front-page");
		var userPage = $("#user-page");
		frontPage.remove();
		userPage.toggle();

		user = Cookies.get('loggedinId');

	}


	var showSignIn = function(){
		var formDiv = $('#form-container');
		var source = $('#user-signin-template').html();
		var template = Handlebars.compile(source);

		$('#signup-button').remove();

		$('#signin-button').remove();

		formDiv.append(template());

		$('.signin-submit').click(function(){
			console.log('lol');
			signinSubmit();
		})
	};

	var signinSubmit = function(){
		var usernameInput = $("#username").val()

		var passwordInput = $("#password").val()

		var user = {
			username: usernameInput,
			password_hash: passwordInput
		};

		$.ajax({
			url: 'http://localhost:3000/users/login',
			method: 'POST',
			data: user,
		}).done(userShow());
	};














