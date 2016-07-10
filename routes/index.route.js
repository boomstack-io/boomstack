const express = require('express');
const router = express.Router();
const stormpath = require('express-stormpath');
const Bookmark = require('../models/bookmark.model');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Boomstack', message: '' });
});

router.get('/hello', stormpath.loginRequired, (req, res) => {
  res.render('index', { title: 'Boomstack Stack', message: 'Welcome !' });
});

router.get('/bookmarks', stormpath.loginRequired, (req, res, next) => {
  Bookmark.find({ user: req.user.username }, (err, bookmarks) => {
    if (err) next(err);
    else res.json(bookmarks);
  });
});

router.post('/bookmark', stormpath.loginRequired, (req, res, next) => {
  const bookmark = new Bookmark({
    user: req.user.username,
    title: req.body.title,
  });

  bookmark.save((err, bm) => {
    if (err) next(err);
    else res.json(bm);
  });
});

module.exports = router;
