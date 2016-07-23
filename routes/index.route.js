const express = require('express');
const router = express.Router();// eslint-disable-line
const stormpath = require('express-stormpath');
const Bookmark = require('../models/bookmark.model');
const getPageTitle = require('../tools/get-page-title.js');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Boomstack', message: '' });
});

router.get('/hello', stormpath.loginRequired, (req, res) => {
  res.render('hello');
});

router.get('/bookmarks', stormpath.loginRequired, (req, res, next) => {
  let q = Bookmark.find({ user: req.user.username });
  console.log('finding...');
  if (req.query.search) {
    console.log(`Searching for ${req.query.search}`);
    const reg = new RegExp(`.*${req.query.search}.*`);
    q = Bookmark.find(
      {
        user: req.user.username,
        $or: [
          { title: reg },
          { tags: { $elemMatch: { $regex: reg } } },
          { url: reg },
        ],
      }
    );
  }
  if (req.query.offset) q.skip(parseInt(req.query.offset, 10));
  if (req.query.limit) q.limit(parseInt(req.query.limit, 10));

  q
    .sort('-created')
    .exec((err, bookmarks) => {
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

router.delete('/bookmark/:id', stormpath.loginRequired, (req, res, next) => {
  console.log(`Deleting markup n°${req.params.id}`);

  Bookmark.findById(req.params.id, (err, bm) => {
    if (err) next(err);
    if (bm == null) res.status(500).json({ error: 'bookmark does not exists' });

    bm.remove((error, bookmark) => {
      if (error) next(err);
      res.json(bookmark);
    });
  });
});

module.exports = router;
