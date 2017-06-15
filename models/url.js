var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  original: String,
  shortcode: String
});

var ModelClass = mongoose.model('url', urlSchema);
module.exports = ModelClass;
