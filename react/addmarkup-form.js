const React = require('react');
const getParameterByName = require('./getparameterbyname.js');

const baseUrl = '/';

const AddMarkupForm = React.createClass({
  getInitialState() {
    return {
      fieldValue: '',
      buttonText: 'stack it !',
    };
  },

  componentDidMount() {
    const urlStack = getParameterByName('stack', document.location.href);
    if (urlStack) {
      this.setState({
        fieldValue: urlStack,
      });
      window.history.pushState('urlstack', '', baseUrl);
    }
  },

  handleUrlChange(e) {
    this.setState({ fieldValue: e.target.value });

    if (this.isSearch()) {
      this.setState({ buttonText: 'search' });
    } else {
      this.setState({ buttonText: 'bookmark it !' });
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const url = this.state.fieldValue;

    if (this.isSearch()) {
      // console.log('Searching for : ' + this.state.fieldValue);
      if (this.props.onSearch) {
        this.props.onSearch(this.state.fieldValue);
      }
    } else {
      if (this.props.onAddMarkup) {
        this.props.onAddMarkup({ url:url });
        this.setState({ fieldValue: '' });
      }
    }
  },

  isSearch() {
    const match = this.state.fieldValue.match(/^https?:\/\/.*/);
    if (Array.isArray(match) && match.length > 0) {
      // console.log('is search ! ');
      return false;
    }
    return true;
  },

  render() {
    return (
      <div className="row addmarkup-form">
        <form className="form-inline stack-form" onSubmit={this.handleSubmit}>
          <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
            <input
              id="post_content"
              type="text"
              name="content"
              className="content form-control"
              value={this.state.fieldValue}
              placeholder="paste a link here to add a markup"
              onChange={this.handleUrlChange}
              onKeyUp={this.handleUrlChange}
            />
          </div>
          <div className="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-3 col-md-3 col-lg-3">
            <button className=" add_markup btn btn-default ">{this.state.buttonText}</button>
          </div>
        </form>
      </div>
    );
  },
});

module.exports = AddMarkupForm;
