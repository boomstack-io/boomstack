const Bookmark = require('../models/bookmark.model');
const getPageTitle = require('../tools/get-page-title.js');

const bookmarkController = {
  getBookmarks: (username = null, search = null, offset = 0, limit = 10) => {// eslint-disable-line
    return new Promise((resolve, reject) => {
      if (!username) return reject('user not loggged id');
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
          if (err) return reject(err);
          return resolve(bookmarks);
        });
      return null;
    });
  },

  addBookmark: (username, url) => {// eslint-disable-line
    return new Promise((resolve, reject) => {
      if (!username) return reject('user not loggged id');
      if (!url.match(/^https?/)) return reject('incorrect url format');
      getPageTitle(url)
        .catch(() => '')
        .then((title) => {
          const bookmark = new Bookmark({
            user: username,
            title,
            url,
          });
          // res.json(title);
          bookmark.save((err, bm) => {
            if (err) return reject(err);
            return resolve(bm);
          });
        });
      return null;
    });
  },

  deleteBookmark: (username, id) => {// eslint-disable-line
    return new Promise((resolve, reject) => {
      console.log(`Deleting markup n°${id}`);
      Bookmark.findOne({ _id: id, user: username }, (err, bm) => {
        if (err) return reject(err);
        if (bm == null) return reject('bookmark does not exists');
        bm.remove((error, bookmark) => {
          if (error) reject(err);
          else resolve(bookmark);
        });
        return null;
      });
    });
  },
};

module.exports = bookmarkController;
