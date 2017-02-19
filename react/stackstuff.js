const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const $ = require('jquery');
const stopWords = require('stopwords-json');

const MarkupList = require('./markup-list.js');
const AddMarkupForm = require('./addmarkup-form.js');
const AddTagForm = require('./addtag-form.js');
const PostLoader = require('./post-loader.js');

const baseUrl = '/';
const csrfToken = $('meta[name="csrf-token"]').attr('content');

const StackStuff = React.createClass({

  getInitialState() {
    return {
      markups: [],
      loading: true,
      offset: 0,
      limit: 10,
      showAddTagsForm: false,
      search: '',
    };
  },

  componentDidMount() {
    this.reloadMarkups();
  },

  handleAddMarkup(data) {
    $.ajax(`${baseUrl}bookmark`, {
      method: 'post',
      data: {
        url: data.url,
        _csrf: csrfToken,
      },
      dataType: 'json',
      success: (res) => {
        const markups = this.state.markups;
        markups.unshift(res);

        this.setState({
          markups,
          loading: false,
          offset: this.state.offset + 1,
          showAddTagsForm: true,
        });
      },

      error(xhr, status, error) {
        console.log(error);
      },
    });
  },

  handleLoadMore() {
    if (!this.state.loading
      && (this.state.markups.length >= this.state.offset + this.state.limit)) {
      this.setState({
        loading: true,
        offset: this.state.offset + this.state.limit,
      });

      $.ajax(baseUrl + 'bookmarks', {
        method: 'get',
        data: {
          offset: this.state.offset,
          limit: this.state.limit,
          search: this.state.search,
        },
        success: (res) => {
          const markups = this.state.markups.concat(res);
          this.setState({
            markups,
            loading: false,
          });
        },
      });
    }
  },

  handleAddTagToLastMarkup(tags) {
    console.log('Adding tags : ' + tags);
    if (tags && tags.length > 0) {
      const tagsString = tags.join(',');
      const id = this.state.markups[0]._id;

      $.ajax(baseUrl + 'bookmark/' + id + '/tags', {
        method: 'post',
        data: {
          tags: tagsString,
          _csrf: csrfToken,
          dataType: 'json',
        },
        success: (res) => {
          this.replaceMarkup(res);
          this.setState({ showAddTagsForm: false });
        },
      });
    }
  },

  handleCancelAddTag() {
    this.setState({ showAddTagsForm: false });
  },

  handleSearch(searchString) {
    console.log('searching ' + searchString);
    this.setState({
      search: searchString,
      offset: 0,
      limit: 10,
    }, () => {
      this.reloadMarkups();
    });
  },

  reloadMarkups() {
    this.setState({ loading: true });

    $.ajax(baseUrl + 'bookmarks', {
      method: 'get',
      dataType: 'json',
      data: {
        search: this.state.search,
        offset: this.state.offset,
        limit: this.state.limit,
      },
      success: (data) => {
        this.setState({
          markups: data,
          loading: false,
        });
      },
    });
  },

  replaceMarkup(newMarkup) {
    const id = newMarkup.id;
    const markups = this.state.markups;

    const index = markups.findIndex((elem) => {
      if (elem.id === id) return true;
      return false;
    });

    markups[index] = newMarkup;

    this.setState({
      markups,
    });
  },

  handleMarkupDelete(markupId) {
    const index = this.state.markups.findIndex((elem) => {
      if (elem._id === markupId) return true;
      return false;
    });

    if (index === -1) {
      // console.log('Markup with id ' + markupId + ' not found !');
      return;
    }

    // console.log('Deleting markup ' + markupId + ' (index: ' + index + ')');

    $.ajax(baseUrl + 'bookmark/' + markupId, {
      type: 'DELETE',
      data: { _csrf: csrfToken },
      success: () => {
        // console.log('Successfuly deleted: ' + data);
        const markups = this.state.markups;
        markups.splice(index, 1);

        this.setState({
          markups,
          offset: this.state.offset - 1,
        });
      },
      error(xhr, status, error) {
        console.log(error);
      },
    });
  },

  eliminateStopWordsInTagsArray(tags) {
    const cleanTags = [];
    tags.forEach((tag) => {
      if (tag === '') return;
      const sw = stopWords;
      const t = tag.toLowerCase();
      // searching for the tag in stopwords list... (for every languages)
      const r = Object.keys(sw).find((l) => sw[l].find((s) => s === t) !== undefined);
      if (r === undefined) cleanTags.push(tag);
      // else console.log(`Eliminated stop word: ${tag}`);
    });
    return cleanTags;
  },

  renderAddTagForm() {
    if (!this.state.markups || this.state.markups.length === 0) return null;
    const lastMarkup = this.state.markups[0];
    const tags = lastMarkup.tags || [];
    const rawTags = tags.map((tag) => tag.name);

    let suggestedTags = [];
    if (lastMarkup.title) suggestedTags = lastMarkup.title.split(/[ ,.;:|]/);
    suggestedTags = this.eliminateStopWordsInTagsArray(suggestedTags);

    return (
      <AddTagForm
        tags={tags}
        suggestedTags={suggestedTags}
        onAddTag={this.handleAddTagToLastMarkup}
        onCancel={this.handleCancelAddTag}
      />);
  },

  render() {
    // Display the form to add a markup,*or* the form to add a tag if we just added a markup
    let addTagForm = null;
    let addMarkupForm = null;
    if (this.state.showAddTagsForm) addTagForm = this.renderAddTagForm();
    else {
      addMarkupForm = (
        <AddMarkupForm
          onAddMarkup={this.handleAddMarkup}
          onSearch={this.handleSearch}
        />);
    }

    return (
      <div>
        <ul className="list-group controller">
          <li className="list-group-item">
            <ReactCSSTransitionGroup
              transitionName="mainForms"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
            >
              {addMarkupForm}
              {addTagForm}
            </ReactCSSTransitionGroup>
          </li>
        </ul>
        <MarkupList markups={this.state.markups} onMarkupDelete={this.handleMarkupDelete} />
        <PostLoader onLoadMore={this.handleLoadMore} active={!this.state.loading} />
      </div>
    );
  },
});

module.exports = StackStuff;
