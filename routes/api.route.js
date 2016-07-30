const express = require('express');
const router = express.Router();// eslint-disable-line
const stormpath = require('express-stormpath');
const bookmarkRoutesHandlers = require('./bookmark-routes-handlers');

router.get('/bookmarks',
  stormpath.apiAuthenticationRequired, bookmarkRoutesHandlers.getBookmarks);
router.post('/bookmark',
  stormpath.apiAuthenticationRequired, bookmarkRoutesHandlers.addBookmark);
router.delete('/bookmark/:id',
  stormpath.apiAuthenticationRequired, bookmarkRoutesHandlers.deleteBookmark);
router.post('/bookmark/:id/tags',
  stormpath.apiAuthenticationRequired, bookmarkRoutesHandlers.addTags);

module.exports = router;
