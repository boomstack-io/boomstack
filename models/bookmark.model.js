const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  user: String,
  title: { type: String, text: true },
  url: { type: String, text: true },
  tags: { type: [String], text: true },
  created: { type: Date, default: Date.now },
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

module.exports = Bookmark;
