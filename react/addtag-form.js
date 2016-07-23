var React = require('react');
var TagsInput = require('react-tagsinput');

var AddTagForm = React.createClass({

  getInitialState: function () {
    return {
      tags: [],
      selectedTags: [],
    };
  },

  componentDidMount: function () {
    //console.log("componentDidMount");
    var tags = [];
    var selectedTags = [];

    if (Array.isArray(this.props.tags)) {
      tags = tags.concat(this.props.tags);
      selectedTags = selectedTags.concat(this.props.tags);
    }

    if (Array.isArray(this.props.suggestedTags)) {
      tags = tags.concat(this.props.suggestedTags);
    }

    this.setState({
      tags: tags,
      selectedTags: selectedTags,
    });

  },

  componentWillUpdate: function (nextProps, nextState) {
    //console.log('componentWillUpdate');
    var suggestedTags = this.props.suggestedTags || [];
    var nextSuggestedTags = nextProps.suggestedTags || [];

    if (Array.isArray(nextProps.tags)) {
      if (this.props.tags.join(',') != nextProps.tags.join(',') || suggestedTags.join(',') != nextSuggestedTags.join(',')) {
        this.setState({
          tags:this.cleanTagList(nextProps.tags.concat(nextSuggestedTags)),
          selectedTags:this.cleanTagList(nextProps.tags),
        });
      }
    }
  },

  cleanTagList: function (tags) {
    /* eliminate duplicate content in tag list */
    var filteredTags = tags.map(function (elem) {
      return elem.toString().toLowerCase();
    });

    filteredTags = filteredTags.filter(function (elem, index, arr) {
      return (index === arr.lastIndexOf(elem));
    });

    console.log('Filtered tags : ' + filteredTags);
    return filteredTags;
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (this.props.onAddTag)
        this.props.onAddTag(this.state.selectedTags);

  },

  handleChange: function (tags) {
    var _this = this;
    var newTags = tags.filter(function (elem) {return (_this.state.tags.indexOf(elem) === -1);});

    this.setState({
      tags: tags,
      selectedTags: this.state.selectedTags.concat(newTags),
    });

  },

  handleTagClick: function (tagString, ev) {
    if ((this.state.selectedTags.indexOf(tagString) === -1)) {//not selected yet
      this.setState({ selectedTags:this.state.selectedTags.concat([tagString]) });
    } else {
      var newArray = this.state.selectedTags.filter(function (elem) {return elem !== tagString;});

      this.setState({ selectedTags:newArray });
    }

    //console.log(this.state);
  },

  handleCancel: function (e) {
    e.preventDefault();
    if (this.props.onCancel)
      this.props.onCancel();
  },

  renderTag: function (props) {
    //console.log(props);
    var chosen = (this.state.selectedTags.indexOf(props.tag) !== -1) ? ' chosen' : '';
    var classes = props.className + chosen;
    return (
        <span
          key={props.key}
          className={classes}
          onClick={this.handleTagClick.bind(this, props.tag)}>
            {props.tag}
        </span>
    );
  },

  render: function () {
    var classes = 'form-inline ';

    return (
    <div>
      <h3>Do you want to add tags to this markup ?</h3>
      <form className={classes} onSubmit={this.handleSubmit}>
        <TagsInput value={this.state.tags} onChange={this.handleChange} renderTag={this.renderTag} onlyUnique={true}/>
        <div className="btn-group">
          <input type="submit" id="add_tag" className="btn btn-primary" value="Add tag !"/>
          <button className="btn btn-default" onClick={this.handleCancel}>No thanks</button>
        </div>
      </form>
    </div>
);
  },
});

module.exports = AddTagForm;
