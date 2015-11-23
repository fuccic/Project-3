var express      = require('express'),
    mongoose     = require('mongoose'),
    bodyParser   = require('body-parser'),
    nodeDebugger = require('node-debugger'),
    morgan 		 = require('morgan');

var port         = process.env.PORT || 3000;
var app          = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost/itineraries');

var Map = require('./models/map');

app.listen(port);

// var map1 = new Map({
// 	locations: ["test"]
// });

// map1.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + map1);
// });

//////ROUTES//////

app.get('/maps', function(req, res) {
	Map.find().then(function(maps) {
		res.send(maps);
	});
});