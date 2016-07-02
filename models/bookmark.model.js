var mongoose = require('mongoose');

var BookmarkSchema = mongoose.Schema({
  title: String,
  url: String,
  tags: [String],
  created: { type: Date, default: Date.now },
});

var Bookmark = mongoose.model('Bookmark', BookmarkSchema);

module.exports = Bookmark;