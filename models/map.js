var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var MapSchema = new mongoose.Schema({
	locations: [PlaceSchema]
});

var Map = mongoose.model('Map', MapSchema);
module.exports = Map;

