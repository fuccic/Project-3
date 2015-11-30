console.log("Test");
var currentItinerary;
var user = null;

// var map;
// var bounds = new google.maps.LatLngBounds();
var currentLocation;

$(function() {

// =================
// GRABBER VARIABLES
// =================

	var $newLocation = $('#new-location');
	// console.log($newLocation);
	var $itineraryList = $('#itinerary-info');
	// console.log($itineraryList);
	var $cityButton = $('#city-button');
	// console.log($cityButton);
	var $saveLocationButton = $('#save-location');
	// console.log($saveLocationButton);
	var $pacInputGet = $('#pac-input');
	// console.log($pacInputGet);
	var $pacInputGet2 = $('#pac-input-2');
	// console.log($pacInputGet2);
	var $itineraryButton = $('#itinerary-button');
	// console.log($itineraryButton);
	var $pacInputGet3 = $('#pac-input-3');
	// console.log($pacInputGet3);
	var $closeButton = $('#close-button');
	// console.log($closeButton);
	var $nameInput = $('#name-input');
	// console.log($nameInput);
	var $locationList = $('#populated-list');
	console.log($locationList);

	$cityButton.click(function() {
		console.log("Save map to Mongo");
		currentItinerary = "";
		currentItinerary = $nameInput.val();
		// console.log($nameInput.val());
		// console.log(currentItinerary);
		$saveLocationButton.show();
		pacIdChangeBack();
		createMap();
	});

	// function that initalizes Google map, location autocomplete, sets marker positons on location. 
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
	    animation: google.maps.Animation.BOUNCE,
	    anchorPoint: new google.maps.Point(0, -29)
	  });

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
      } 
      else {
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
	     function toggleBounce() {
  			if (marker.getAnimation() !== null) {
    		marker.setAnimation(null);
  			} else {
    		marker.setAnimation(google.maps.Animation.BOUNCE);
 			}
		}	
	  });
	}; //END OF INITMAP FUNCTION	

// ==========================
// CALLING INIT MAP FUCTION
// ==========================
	initMap();
// ==========================
// ==========================

  $saveLocationButton.click(function() {
		// console.log("Save place to Mongo");

		createPlace();	
		console.log(currentItinerary);
		getLocation(currentItinerary);
		generateItineraryList(currentItinerary);
	});

	// allows user to input a location and makes an ajax request to add it to the user's itinerary
  var createPlace = function() {
  	// console.log(currentItinerary);
  	var name = currentLocation.name;
  	var lat = currentLocation.geometry.location.lat();
  	var lng = currentLocation.geometry.location.lng();
  	var address = currentLocation.formatted_address;
  	var phoneNumber = currentLocation.formatted_phone_number;
	var website = currentLocation.website;
	var placeId = currentLocation.place_id;
	// console.log('ajax to create map');
	var mapData = {
		name: name,
		address: address,
		lat: lat,
		lng: lng,
		phone: phoneNumber,
		website: website,
		place_id: placeId,
		itinerary: currentItinerary
	};
	$locationList.text(name);
	console.log(name);
		$.ajax({
			url: "http://localhost:3000/maps/place",
			method: "POST",
			data: mapData
		}).done(); 
  };	

	// function that allows user to create new trip itinerary(map), and to name their trip. 
  var createMap = function() {
  	var name = $('#name-input').val();
  	var lat = currentLocation.geometry.location.lat();
  	var lng = currentLocation.geometry.location.lng();
		// console.log('ajax to create map');
		var mapData = {
			name: name,
			city_lat: lat,
			city_lng: lng 
		};
		$.ajax({
			url: "http://localhost:3000/maps",
			method: "POST",
			data: mapData
		}).done();
  };	
  
  var pacIdChange = function(){
		$pacInputGet.attr("id","pac-input-3");
		$pacInputGet2.attr("id","pac-input");
	};

	var pacIdChangeBack = function(){
		$pacInputGet.attr("id","pac-input-2");
		$pacInputGet3.attr("id","pac-input");
	};

	$closeButton.click(function(){
		pacIdChangeBack();
		$saveLocationButton.show();
	});

	$itineraryButton.click(function(){	
		$itineraryList.hide();
		pacIdChange();
		$saveLocationButton.hide();
		initMap();
		// console.log($pacInputGet2);
		// console.log($pacInputGet);
	});


	var $signupButton = $('#signup-button');
	// generates signup form on click
	$signupButton.click(function(){
		signUpForm();
	});

	var $signinButton = $('#signin-button');
	// generates signin form on click
	$signinButton.click(function(){
		showSignIn();
	});

	var $logoutButton = $('#logout');
	// logs user out on click
	$logoutButton.click(function(){
		Cookies.remove('loggedinId');
		initMap();
		currentItinerary = "";
		// $pacInputGet2.hide();
		$('#front-page').show();
		$('#user-page').toggle();
	});

	if(Cookies.get('loggedinId') === undefined){
		showSplashPage();
	}else{
		userShow();
	}

	var $dropdownButton = $('#dropdown-button');
	// console.log($dropdownButton);
	// on click of itinerary list, it populates the names of the trips in the dropdown menu
	$dropdownButton.click(function(){
		getItineraries();
	});

});////////END OF WINDOW ONLOAD


var $itineraryList = $('#itinerary-list');
// console.log($itineraryList);

var generateItineraryList = function(data) {
	// console.log('before ajax');
	// console.log(data);
	// console.log(currentItinerary);
	var locationsData = {
		"itinerary" : data
	};
	$.ajax({
		url: 'http://localhost:3000/users/locations',
		method: 'GET',
		dataType: 'json',
		data: locationsData
	}).done(displayLocations);
};

var displayLocations = function(data){
	console.log(data);
	$itineraryList.empty();
 	for(var i = 0; i<data.length; i++){
 		// console.log(data[i]);
 		if(i % 2 === 0){
	 		var $locationItem = $('<li>');
	 		var $locationLink = $('<a href="#"></a>');
	 		var $removeButton = $('<button>');
	 		$locationLink.html(data[i]);
	 		$locationLink.attr({id: data[i + 1], "class": "location-name"});
	 		$removeButton.attr({id: data[i + 1],"class": "delete-button btn-xs btn-default glyphicon glyphicon-minus"});
	 		$locationItem.append($locationLink);
	 		$locationItem.append($removeButton);
	 		$itineraryList.append($locationItem);
	 		console.log($(".delete-button"));
	 	}
 	};
 	var currentLocation = $('.location-name');
	// console.log(currentLocation);
	$('a').click(currentLocation, function(){
		// console.log($(this).html());
		// console.log(typeof $(this).html());
		console.log("yehahhhh");
	});

	var $deleteLocation = $('.delete-button');
	// console.log($deleteLocation);

	$deleteLocation.click(function(){
		// console.log("location deleted");
		var buttonId = event.target.id
		deletePlace(buttonId);
		$itineraryList.empty();
		generateItineraryList(currentItinerary);
		getLocation(currentItinerary);
	});

};


var deletePlace = function(stringId){
	var placeIdentification = stringId;
	console.log(placeIdentification);
  	var data = {
  		identification: placeIdentification,
  		itinerary: currentItinerary
  	}
  	$.ajax({
		url: 'http://localhost:3000/maps/place',
		method: 'DELETE',
		dataType: 'json',
		data: data
	}).done(console.log("Deleted some shit"));
};

var $userItineraryList = $('#user-itineraries');
// console.log($userItineraryList);

var getItineraries = function(){
	$.ajax({
	url: 'http://localhost:3000/users/itineraries',
	method: 'GET',
	dataType: 'json'
	}).done(populateItineraries);
};

// adds the name of each itinerary, as well ad a link to that specific itineray to the dropdown menu
var populateItineraries = function(data){
 	$userItineraryList.empty();
 	for(var i = 0; i<data.length; i++){
 		var $locationItem = $('<li>');
 		var $locationLink = $('<a href="#"></a>')
 		$locationLink.html(data[i]);
 		$locationLink.attr({id: i, "class": "itinerary-name"});
 		$locationItem.append($locationLink);
 		$userItineraryList.append($locationItem);
 	};
 	var currentLocation = $('.itinerary-name');
	// console.log(currentLocation);
	$('a').click(currentLocation, function(){
		// console.log($(this).html());
		// console.log(typeof $(this).html());
		currentItinerary = $(this).html();
		// console.log(currentItinerary);
		getLocation($(this).html());
		generateItineraryList(currentItinerary);
	});
};


var itineraryNames = document.getElementsByClassName('itinerary-name');

// places all of the markers for a specific itinerary on the map. 
var getLocation = function(data) {
	// console.log('before ajax');
	// console.log(data);
	var itineraryData = {
		"itinerary" : data
	};
	$.ajax({
		url: 'http://localhost:3000/maps/populate',
		method: 'GET',
		dataType: 'json',
		data: itineraryData
	}).done(renderMarkers);
};

// uses Googles autocomplete feature to allow user to search for different locations, add them to their itinerary, as well as a marker. 
var renderMarkers = function(data) {
 // console.log(data);
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		// maxZoom: 2,
		// minZoom: 2,
		// streetViewControl: false,
		draggable: true,
		// mapTypeControl: false,
		center: {lat: data[0].lat, lng: data[0].lng},
		 // center: new google.maps.LatLng(data.city_lat, data.city_lng)
		// mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	var input = document.getElementById('pac-input');
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

	autocomplete.addListener('place_changed', function() {
	marker.setVisible(false);
    var place = autocomplete.getPlace();
    currentLocation = place;
    $addLocation = $('<li>');
    $addLocation.html(place.name);
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } 
    else {
      map.setCenter(place.geometry.location);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
	});

	for(var i=0;i<data.length;i++) {
		console.log(data);
		var contentString = "<strong>" + data[i].name + "</strong>" + "<br>" + data[i].address;
		var infowindow = new google.maps.InfoWindow({
    	content: contentString
  	});

		var marker = new google.maps.Marker ({
	    position: {lat: data[i].lat, lng: data[i].lng},
	    map: map,
	    title: "Maps are cool"
		});

		marker.addListener('click', function() {
    infowindow.open(map, marker);
  	});
	};
};

// generates the sign up form, on click it runs the createUser function 
var signUpForm = function(){
	var formDiv = $('#form-container');
	$('#signup-button').remove();
	$('#signin-button').remove();
	var source = $('#user-signup-template').html();
	var template = Handlebars.compile(source);
	formDiv.append(template());

	$('#new-user-submit').click(function(){
		createUser();
	});
};

// function that creates a user
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

// 
var userShow = function(data){
	var frontPage = $("#front-page");
	var userPage = $("#user-page");
	frontPage.hide();
	userPage.toggle();
	user = Cookies.get('loggedinId');
};

// shows user sign in field, on click it runs sign in submit
var showSignIn = function(){
	var formDiv = $('#form-container');
	var source = $('#user-signin-template').html();
	var template = Handlebars.compile(source);
	$('#signup-button').hide();
	$('#signin-button').hide();
	formDiv.append(template());
	$('.signin-submit').click(function(){
		signinSubmit();
		$('#username').val('');
		$('#password').val('');
	});
};

// signs in the user
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
		statusCode: {
      503: function (response) {
     	},
     	200: function (response) {
         userShow();
     	}
    }
	})
};

var showSplashPage = function(){
		$('#username').hide();
		$('#password').hide();
		$('.signin-submit').hide();
		$('#signup-button').show();
		$('#signin-button').show();
};