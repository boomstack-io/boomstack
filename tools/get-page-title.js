const getContent = require('./get-content.js');

function getPagetitle(url) {
  return getContent(url)
  .then((html) => {
    const matches = html.match(/<title>([^<]*)<\/title>/);
    let title = '';
    if (matches && matches.length >= 2 && typeof matches[1] === 'string') {
      title = matches[1];
    }
    return title;
  });
}

module.exports = getPagetitle;
