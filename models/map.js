var mongoose = require('mongoose');

var MapSchema = new mongoose.Schema({
	locations: []
});

var Map = mongoose.model('Map', MapSchema);
module.exports = Map;

