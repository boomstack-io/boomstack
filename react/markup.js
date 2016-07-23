const React = require('react');
const parseUri = require('./parseuri.js');
const he = require('he');

const Markup = React.createClass({

  propTypes: {

    url: React.PropTypes.string.isRequired,
    tags: React.PropTypes.array,
    children: React.PropTypes.string.isRequired,
  },

  handleDelete() {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.id_markup);
    }
  },

  renderTags() {
    if (!this.props.tags) return null;
    const tagsNodes = this.props.tags.map(
      (tag) => (<span className="label label-default">{tag}</span>));
    return tagsNodes;
  },

  renderUrl() {
    if (!this.props.url) return '';
    else if (!this.props.url.match(/^https?:\/\/.*/)) return 'http://' + this.props.url;
    return this.props.url;
  },

  render() {
    const parsedUrl = parseUri(this.props.url);
    const tagsNodes = this.renderTags();
    let host = '';
    if (this.props.url) host = parsedUrl.host;

    return (
      <li className="list-group-item markup">
        <div className="post-title">{he.decode(this.props.children)} {tagsNodes}</div>
        <div className="post-link">
          <a target="_blank" rel="nofollow" href={this.renderUrl()}>{host}</a>
        </div>
        <div className="markup-delete" onClick={this.handleDelete}>
          <span className="glyphicon glyphicon-trash"></span>
        </div>
      </li>
    );
  },

});

module.exports = Markup;
