var mongoose = require('mongoose');

var PlaceSchema = new mongoose.Schema({
	locations: []
});

var Place = mongoose.model('Place', PlaceSchema);
module.exports = Place;

