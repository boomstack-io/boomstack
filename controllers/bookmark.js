const Bookmark = require('../models/bookmark.model');
const getPageTitle = require('../tools/get-page-title.js');

const bookmarkController = {
  getBookmarks: (username = null, search = null, offset = 0, limit = 10) => {// eslint-disable-line
    return new Promise((resolve, reject) => {
      if (!username) {
        reject('user not loggged id');
      }
      let q = Bookmark.find({ user: username });
      console.log('finding...');
      if (search) {
        console.log(`Searching for ${search}`);
        const reg = new RegExp(`.*${search}.*`);
        q = Bookmark.find(
          {
            user: username,
            $or: [
              { title: reg },
              { tags: { $elemMatch: { $regex: reg } } },
              { url: reg },
            ],
          }
        );
      }
      if (offset) q.skip(parseInt(offset, 10));
      if (limit) q.limit(parseInt(limit, 10));
      q
        .sort('-created')
        .exec((err, bookmarks) => {
          if (err) reject(err);
          resolve(bookmarks);
        });
    });
  },

  addBookmark: (req, res, next) => {
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
  },

  deleteBookmark: (req, res, next) => {
    console.log(`Deleting markup n°${req.params.id}`);
    Bookmark.findById(req.params.id, (err, bm) => {
      if (err) next(err);
      if (bm == null) res.status(500).json({ error: 'bookmark does not exists' });
      bm.remove((error, bookmark) => {
        if (error) next(err);
        res.json(bookmark);
      });
    });
  },
};

module.exports = bookmarkController;
