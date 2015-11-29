// =============
// REQUIREMENTS
// =============
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    nodeDebugger = require('node-debugger'),
    morgan = require('morgan'),
    md5 = require('md5'),
    cookieParser = require('cookie-parser');

var port = process.env.PORT || 3000;
var app = express();

// =============
// MIDDLEWARE
// =============
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(cookieParser());

// =============
// DATABASE
// =============
mongoose.connect('mongodb://localhost/itineraries');

// =============
// MODELS
// =============
var Map = require('./models/map');
var Place = require('./models/place');
var User = require('./models/user');

// =============
// LISTENER
// =============
app.listen(port);

// =============
// ROUTES
// =============

// GET route to show all users in Json
app.get('/users', function(req, res){
  User.find().then(function(users){
    res.send(users);
  });
});

// GET route to show all maps in Json 
app.get('/maps', function(req, res) {
	Map.find().then(function(maps) {
		res.send(maps);
	});
});

// GET route used by getLocation and genderMarkers functions in app.js
app.get('/maps/populate', function(req, res) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  // console.log(url_parts.query.itinerary);
  var itineraryQuery = url_parts.query.itinerary;
  // console.log(req.url)
  // var url_parts = url.parse(request.url, true);
  // var query = url_parts.query;
  // var itineraryName = req.body.data;
	// var itineraryName = req.body.trip
  var currentUser = req.cookies.loggedinId;
  var popArray = [];
  User.findOne({'_id' : currentUser}, 'itineraries', function(err, user){
    for(var i = 0; i<user.itineraries.length;i++){
      for(var x = 0; x<user.itineraries[i].locations.length; x++){
        if(user.itineraries[i].name === itineraryQuery){
          popArray.push(user.itineraries[i].locations[x]);
          // res.send(user.itineraries[i].locations[x]);
        };
      };
    };
    res.send(popArray);
  });
});

// GET route used by getItineraries and populateItineraries functions in app.js
app.get('/users/itineraries', function(req, res){
  var currentUser = req.cookies.loggedinId;
  var locationList = [];
  User.findOne({'_id' : currentUser}, 'itineraries', function(err, user){
    for(var i = 0; i<user.itineraries.length;i++){
      var currentLocationName = user.itineraries[i].name
      locationList.push(currentLocationName)
    };
  res.send(locationList);
  });
});

// POST route used by createPlace functions in app.js
app.post('/maps/place', function(req, res) {
  // console.log(req.body);
  var itineraryQuery = req.body.itinerary;
	var name = req.body.name;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var address = req.body.address;
  var phoneNumber = req.body.phone;
  var website = req.body.website;
  var placeId = req.body.place_id;
  // console.log(itineraryQuery);
  var currentUser = req.cookies.loggedinId;
  var place = new Place({
    name: name,
    lat: lat,
    lng: lng,
    address: address,
    phoneNumber: phoneNumber,
    website: website,
    placeId: placeId
  });

  // Mongoose query below finds the currentUser, using the cookie. It loops through the user's itineraries and compares each value to the itinerary key value pair in the req. Once there is a match, that place object is pushed into the locations array. 
  User.findOne({'_id' : currentUser}, 'itineraries', function(err, user){
    for(var i = 0; i<user.itineraries.length;i++){
      if(user.itineraries[i].name === itineraryQuery){
        // console.log(user.itineraries[i].locations);
        user.itineraries[i].locations.push(place);
        user.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            res.send(user)
          }
        });
      }else{
        console.log("Failed to post new location to itinerary");
      };
     };
  });
});


// DELETE request removing a location from an itinerary
app.delete('/maps/place', function(req,res){

  var currentUser = req.cookies.loggedinId;
  // console.log(currentUser);
  var itinerary = req.body.itinerary;
  // console.log(itinerary);
  var placeNumber = req.body.identification;
  console.log(placeNumber);
  console.log(req.body);

  User.findOne({'_id' : currentUser}, 'itineraries', function(err, user){
    // console.log(user.itineraries);
  for(var i = 0; i<user.itineraries.length;i++){
    if (user.itineraries[i].name === itinerary){
      // console.log(user.itineraries[i].locations);
      for (var x = 0; x < user.itineraries[i].locations.length; x++) {
        // console.log(user.itineraries[i].locations[x]);
        // console.log("LOCATION ID: " + user.itineraries[i].locations[x].id)
        if(user.itineraries[i].locations[x].id === placeNumber){
            console.log("THIS IS DELETED: " + user.itineraries[i].locations[x].id);
            user.itineraries[i].locations[x].remove();
          } 
        };
      };
    };
    user.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log(user.itineraries[i].locations);
      };  
    });
  });
});
// POST request used by the createMap function in app.js
app.post('/maps', function(req, res) {
  // console.log(res.cookie("loggedinId"));
  // console.log(req.body);
  var name = req.body.name;
  var city_lat = req.body.city_lat;
  var city_lng = req.body.city_lng;
  var currentUser = req.cookies.loggedinId;
  // console.log(currentUser);
  var map = new Map({
    name: name,
    city_lat: city_lat,
    city_lng: city_lng
  });

  // Mongoose query below finds the currentUser, using the cookie. It then pushes the map object into the user's itineraries array. 
  User.findOne({'_id' : currentUser}).exec(function(err, user){
    // console.log(user.itineraries);
    user.itineraries.push(map);
    // console.log(user.itineraries);
    user.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.send(user)
      }
    });
  }); 
});

// POST requet used by createUser and userShow functions in app.js. Creates a user. 
app.post('/users', function(req, res){
	password_hash = md5(req.body.password_hash);

	var user = new User({
  	username: req.body.username,
  	password_hash: password_hash
	});

	user.save(function(err) {
  	if (err){
      console.log(err);
      res.statusCode = 503;
  	}else{
      console.log(user.username + ' created!');
      //set the cookie!
      res.cookie("loggedinId", user.id);
      res.send(user);
    };  
  });
});

// POST request used by signinSubmit and userShow functions in app.js. Allows a user to log in. 
app.post('/users/login', function(req, res){
  // console.log(req.body.username);
	var username = req.body.username;
  var password_hash = md5(req.body.password_hash);
  // console.log(req.body.password_hash);

  // Mongoose query below find the user and compares the password hashed for authentication and sets the cookie. 
  User.findOne({'username' : username}).exec(function(err, user){
    console.log(user);
    if (user != null && user.password_hash === password_hash) {
      console.log("success");
      res.cookie("loggedinId", user.id);
      res.send(user);
        }
    else{
      res.status(503).send();
    };
  });
});


















