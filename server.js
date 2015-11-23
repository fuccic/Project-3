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

mongoose.connect('mongodb://localhost/map_practice');

var Place = require('./models/place');

app.listen(port);

// var place1 = new Place({
// 	locations: ["test"]
// });

// place1.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + place1);
// });

//////ROUTES//////

app.get('/places', function(req, res) {
	Place.find().then(function(places) {
		res.send(places);
	});
});