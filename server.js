var express      = require('express'),
    mongoose     = require('mongoose'),
    bodyParser   = require('body-parser'),
    nodeDebugger = require('node-debugger'),
    morgan 		 = require('morgan'),
    md5          = require('md5'),
    cookieParser = require('cookie-parser');

var port         = process.env.PORT || 3000;
var app          = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(cookieParser());

mongoose.connect('mongodb://localhost/itineraries');

var Map = require('./models/map');
var Place = require('./models/place');
var User = require('./models/user');

app.listen(port);

// var map1 = new Map({
// 	locations: ["test"]
// });

// map1.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + map1);
// });


// var user1 = new User({
// 	username: "test",
// 	password_hash: "qwerty"
// });

// user1.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + user1);
// });


//////ROUTES//////

app.get('/maps', function(req, res) {
	Map.find().then(function(maps) {
		res.send(maps);
	});
});

app.get('/maps/:id', function(req, res) {
	// console.log(User.find(users));
	Map.findOne( {_id: req.params.id},function(err, map) {
		res.send(map);
	});
});

app.post('/maps', function(req, res) {
	// console.log(req.body);
	var map = new Map(req.body);
	map.locations.push(req.body);
	map.save(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.send(map)
		}
	});
});

app.get('/users', function(req, res){
	User.find().then(function(users){
		res.send(users);
	})
});

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

      res.send(user)
      	};  
  	});
});


app.post('/users/login', function(req, res){
  console.log(req.body.username)
  console.log(req.body.password_hash)
	var username = req.body.username;
  var password_hash = md5(req.body.password_hash);

    User.findOne({'username' : username}).exec(function(err, user){
        if (username != null && user.password_hash === password_hash) {
        	console.log(user.id);
            res.cookie("loggedinId", user.id);
            console.log('Worked');
            res.send(user);
        }
        else {
        	console.log('failed')
        };
    });
});



