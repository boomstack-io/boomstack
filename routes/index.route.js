const express = require('express');
const router = express.Router();// eslint-disable-line
const stormpath = require('express-stormpath');
const Bookmark = require('../models/bookmark.model');
const url = require('url');
const he = require('he');
const bookmarkRoutesHandlers = require('./bookmark-routes-handlers');

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

router.post('/apiKeys', stormpath.loginRequired, (req, res) => {
  req.user.createApiKey((err, apiKey) => {
    if (err) {
      res.status(400).end('Oops!  There was an error: ' + err.userMessage);
    } else {
      res.json(apiKey);
    }
  });
});

router.get('/bookmarks', stormpath.loginRequired, bookmarkRoutesHandlers.getBookmarks);
router.post('/bookmark', stormpath.loginRequired, bookmarkRoutesHandlers.addBookmark);
router.delete('/bookmark/:id', stormpath.loginRequired, bookmarkRoutesHandlers.deleteBookmark);
router.post('/bookmark/:id/tags', stormpath.loginRequired, bookmarkRoutesHandlers.addTags);

module.exports = router;
