const React     = require('react');
const parseUri  = require('./parseuri.js');
const he        = require('he');
const AdvancedTagsInput = require('./advanced-tags-input');

const Markup = React.createClass({

  propTypes: {

    url: React.PropTypes.string.isRequired,
    tags: React.PropTypes.arrayOf(React.PropTypes.string),
    children: React.PropTypes.string.isRequired,
    onUpdateTags: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    id_markup: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  },

  getInitialState() {
    return {
      showToolbar: false,
      edit: false,
      editedTags: [],
    };
  },

  handleDelete() {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.id_markup);
    }
  },

  handleTagsChange(tags) {
    this.setState({ editedTags: tags });
  },

  renderUrl() {
    if (!this.props.url) return '';
    else if (!this.props.url.match(/^https?:\/\/.*/)) return 'http://' + this.props.url;
    return this.props.url;
  },

  toogleEditToolbar() {
    this.setState({ showToolbar: !this.state.showToolbar });
  },

  closeEditToolbar() {
    this.setState({ showToolbar: false });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      editTags: nextProps.tags,
    });
  },

  editTags() {
    this.setState({
      edit: !this.state.edit,
      editedTags: this.props.tags,
    });
  },

  saveNewTags() {
    if (this.props.onUpdateTags) this.props.onUpdateTags(this.props.id_markup, this.state.editedTags);
    this.setState({
      edit: false,
    })
  },

  renderTags() {
    if (!this.props.tags) return null;
    const tagsNodes = this.props.tags.map(
      (tag, i) => (<span key={i} className="label label-default">{tag}</span>));
    return tagsNodes;
  },

  render() {
    const parsedUrl = parseUri(this.props.url);
    const tagsNodes = this.renderTags();
    let host = '';
    if (this.props.url) host = parsedUrl.host;

    return (
      <div className="markup">
        <div className="post-title">{he.decode(this.props.children)} {tagsNodes}</div>
        <div className="post-link">
          <a target="_blank" rel="nofollow noopener noreferrer" href={this.renderUrl()}>{host}</a>
        </div>
        <div className={`edit-toolbar ${this.state.showToolbar ? 'opened' : ''}`} onMouseLeave={this.closeEditToolbar}>
          <a className="handle" onClick={this.toogleEditToolbar}></a>
          <a className="delete" onClick={this.handleDelete}><span className="glyphicon glyphicon-trash" /></a>
          <a className="edit-tag" onClick={this.editTags}><span className="glyphicon glyphicon-pencil" /></a>
        </div>
        <div className={`tag-edit ${this.state.edit ? 'opened' : ''}`}>
          <AdvancedTagsInput value={this.state.editedTags} onChange={this.handleTagsChange} />
          <button onClick={this.saveNewTags} className="">Save</button>
        </div>
      </div>
    );
  },

});

module.exports = Markup;
