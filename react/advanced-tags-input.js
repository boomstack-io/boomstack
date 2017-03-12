const TagsInput = require('react-tagsinput');
const React     = require('react');

module.exports = class AdvancedTagsInput extends React.Component {
  render() {
    return (<TagsInput value={this.props.value} onChange={this.props.onChange} />);
  }
}