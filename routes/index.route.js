const express = require('express');
const router = express.Router();// eslint-disable-line
const stormpath = require('express-stormpath');
const Bookmark = require('../models/bookmark.model');
const getPageTitle = require('../tools/get-page-title.js');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Boomstack', message: '' });
});

router.get('/bookmarks', stormpath.loginRequired, (req, res, next) => {
  Bookmark.find({ user: req.user.username }, (err, bookmarks) => {
    if (err) next(err);
    else res.json(bookmarks);
  });
});

router.post('/bookmark', stormpath.loginRequired, (req, res, next) => {
  getPageTitle(req.body.url)
    .catch(() => '')
    .then((title) => {
      const bookmark = new Bookmark({
        user: req.user.username,
        title,
        url: req.body.url,
      });
      // res.json(title);

      bookmark.save((err, bm) => {
        if (err) next(err);
        else res.json(bm);
      });
    });
});

router.post('/tags', stormpath.loginRequired, (req, res, next) => {
  // console.log(req.body);
  if (!req.body.id) next(new Error('No bookmark id provided, body:'));

  Bookmark.findById(req.body.id, (err, bm) => {
    if (err) next(err);

    const bookmark = bm;
    const tags = req.body.tags.split(',').map(str => str.trim());
    if (Array.isArray(tags)) {
      bookmark.tags = tags;
      bookmark.save();
      res.json(bookmark);
    }
  });
});

module.exports = router;
