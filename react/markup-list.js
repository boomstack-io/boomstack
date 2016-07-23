const React = require('react');
const Markup = require('./markup.js');

const MarkupList = React.createClass({

  handleMarkupDelete(markupId) {
    if (this.props.onMarkupDelete) {
      this.props.onMarkupDelete(markupId);
    }
  },

  render() {
    if (this.props.markups.length == 0) return (<div></div>);

    const markupNodes = this.props.markups.map((markup) => {
      let title = '';
      if (markup.url) title = markup.url;
      if (markup.title) title = markup.title;

      return (
        <Markup
          key={markup._id}
          url={markup.url}
          id_markup={markup._id}
          tags={markup.tags}
          onDelete={this.handleMarkupDelete}
        >
          {title}
        </Markup>
      );
    });
    return (
      <ul className="list-group markups">{markupNodes}</ul>
    );
  },
});

module.exports = MarkupList;
