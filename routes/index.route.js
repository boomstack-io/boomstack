const express = require('express');
const router = express.Router();// eslint-disable-line
const stormpath = require('express-stormpath');
const Bookmark = require('../models/bookmark.model');
const url = require('url');
const he = require('he');
const bookmarkController = require('../controllers/bookmark');

/* GET home page. */
router.get('/', stormpath.getUser, (req, res, next) => {
  let stack = '';
  if (req.query.stack) stack = req.query.stack;
  if (req.user) res.redirect(`/hello?stack=${stack}`);
  // we print the last bookmarks on index page (from all users) :
  Bookmark
    .find()
    .limit(20)
    .sort('-created')
    .exec((err, lastBookmarks) => {
      if (err) next(err);
      lastBookmarks.forEach((bm) => {
        let host = '';
        if (bm.url) host = url.parse(bm.url).host;
        // we want a variable like host.com to pretty-print the urls in the template
        bm.host = host;// eslint-disable-line

        let prettyTitle = '';
        // transform something like " Title &nbsp; &copy;" in "Title ©" :
        if (bm.title) prettyTitle = he.decode(bm.title);
        bm.prettyTitle = prettyTitle;// eslint-disable-line
      });
      res.render('index', {
        title: 'Boomstack',
        message: '',
        logged: req.user != null,
        lastBookmarks,
      });
    });
});

router.get('/hello', stormpath.loginRequired, (req, res) => {
  res.render('hello', {
    csrfToken: req.csrfToken(),
    logged: true,
  });
});

router.get('/bookmarks', stormpath.loginRequired, (req, res) => {
  bookmarkController
    .getBookmarks(req.user.username, req.query.search, req.query.offset, req.query.limit)
    .then((bookmarks) => { res.json(bookmarks); })
    .catch((err) => res.status(500).send(err));
});

router.post('/bookmark', stormpath.loginRequired, bookmarkController.addBookmark);

router.delete('/bookmark/:id', stormpath.loginRequired, bookmarkController.deleteBookmark);

router.post('/tags', stormpath.loginRequired, (req, res, next) => {
  // console.log(req.body);
  if (!req.body.id) res.status(500).json({ error: 'missing markup id' });

  Bookmark.findById(req.body.id, (err, bm) => {
    if (err) next(err);

    const bookmark = bm;
    const tags = req.body.tags.split(',').map(str => str.trim().toLowerCase());
    if (Array.isArray(tags)) {
      bookmark.tags = tags;
      bookmark.save();
      res.json(bookmark);
    }
  });
});


module.exports = router;
