const stopWords = require(`stopwords-json`);
const he        = require(`he`);

const filterTags = function filterTags (tags) {
  const garbageTags = {};

  // finding stopWords : 
  Object.keys(stopWords).forEach(language => {
    const words = stopWords[language];
    tags.forEach(tag => {
      if (words.find(w => w === tag.toLowerCase())) garbageTags[tag.toLowerCase()] = true;
    })
  })

  return tags.filter(tag => {
    const isGarbage = typeof Object.keys(garbageTags).find(t => t === tag.toLowerCase()) !== `undefined`;
    const isUselessChar = typeof [`-`, `|`, `&`].find(c => c === tag) !== `undefined`;
    return tag && !isGarbage && !isUselessChar;
  });
}

const getSuggestedTags = function getSuggestedTags (url, title) {
  const tags = title.split(/[\s,.;:|]/);
  return filterTags(tags);
};

module.exports = getSuggestedTags;
