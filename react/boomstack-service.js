const $ = require('jquery');
const Promise = require('bluebird');

const baseUrl = '/';
const csrfToken = $('meta[name="csrf-token"]').attr('content');

const ajax = function ajax (url, options) {
  options.data._csrf = csrfToken;
  return new Promise((resolve, reject) => {
    $.ajax(url, Object.assign({}, options, {
      success: data => resolve(data),
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(textStatus);
        console.log(errorThrown);
        reject(jqXHR, textStatus, errorThrown);
      },
      dataType: 'json',
    }));
  });
}


const BoomstackService = {
  getBookmarks (search, limit, offset) {
    return ajax(baseUrl + 'bookmarks', {
      method: 'get',
      data: { offset, limit, search },
    });
  },
  deleteBookmark (bookmark) {
    return ajax(baseUrl + 'bookmark/' + bookmark, {
      method: 'delete',
      data: {},
    });
  },
  addBookmark (url) {
    return ajax(baseUrl + 'bookmark/', {
      method: 'post',
      data: { url },
    });
  },
  addTags (bookmarkId, tags) {
    return ajax(baseUrl + 'bookmark/' + bookmarkId + '/tags/', {
      data: { tags },
      method: 'post',
    });
  },
};



module.exports = BoomstackService;
