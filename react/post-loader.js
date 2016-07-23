const React = require('react');
const $ = require('jquery');

const PostLoader = React.createClass({


  componentDidMount() {
    window.addEventListener('scroll', this.checkVisible, false);
    window.addEventListener('resize', this.checkVisible, false);
    window.setInterval(this.checkVisible, 200);
    this.checkVisible();
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkVisible);
    window.removeEventListener('resize', this.checkVisible);
    window.clearInterval(this.checkVisible);
  },

  isElementInViewport(el) {
    // special bonus for those using jQuery
    if (typeof $ === 'function' && el instanceof $) {
      el = el[0];
    }

    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  checkVisible(e) {
    const $autoloadElement = $('#autoload-trigger');
    // if ( ($(window).height() * 2 + $(window).scrollTop() >= $autoloadElement.offset().top)
    // && this.props.active) {
    if (this.isElementInViewport($autoloadElement)) {
      this.props.onLoadMore();
    }
  },

  render() {
    return (
      <div id="autoload-trigger"></div>
    );
  },
});

module.exports = PostLoader;
