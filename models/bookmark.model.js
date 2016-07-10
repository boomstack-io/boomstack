const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  user: String,
  title: String,
  url: String,
  tags: [String],
  created: { type: Date, default: Date.now },
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

module.exports = Bookmark;
