var mongoose = require('mongoose');

var PlaceSchema = new mongoose.Schema({
	name: String,
	address: String,
	lat: Number,
	lng: Number,
	phone: String,
	website: String,
	place_id: String 
});

var Place = mongoose.model('Place', PlaceSchema);
module.exports = Place;