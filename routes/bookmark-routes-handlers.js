const bookmarkController = require('../controllers/bookmark-controller');

const handlers = {
  getBookmarks(req, res) {
    bookmarkController
      .getBookmarks(req.user.username, req.query.search, req.query.offset, req.query.limit)
      .then((bookmarks) => res.json(bookmarks))
      .catch((err) => res.status(500).send(err));
  },

  addBookmark(req, res) {
    bookmarkController.addBookmark(req.user.username, req.body.url)
      .then((bookmark) => res.json(bookmark))
      .catch((err) => res.status(500).send(err));
  },

  deleteBookmark(req, res) {
    bookmarkController.deleteBookmark(req.user.username, req.params.id)
      .then((bookmark) => res.json(bookmark))
      .catch((err) => res.status(500).send(err));
  },

  addTags(req, res) {
    bookmarkController.addTags(req.user.ursername, req.params.id, req.body.tags)
      .then((bookmark) => res.json(bookmark))
      .catch((err) => res.status(500).send(err));
  },
};

module.exports = handlers;
