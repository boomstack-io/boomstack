var React = require('react');
var getParameterByName = require('./getparameterbyname.js');

var baseUrl = '/';

var AddMarkupForm = React.createClass({

  componentDidMount: function () {
    var urlStack = getParameterByName('stack', document.location.href);
    if (urlStack) {
      this.setState({
        fieldValue: urlStack,
      });
      window.history.pushState('urlstack', '', baseUrl);
    }
  },

  handleUrlChange: function (e) {
    this.setState({ fieldValue:e.target.value });

    //console.log('change ' + this.state.fieldValue);
    if (this.isSearch()) {
      this.setState({ buttonText: 'search' });
    } else {
      this.setState({ buttonText: 'bookmark it !' });
    }
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var url = this.state.fieldValue;

    if (this.isSearch()) {
      console.log('Searching for : ' + this.state.fieldValue);
      if (this.props.onSearch) {
        this.props.onSearch(this.state.fieldValue);
      }
    } else {
      if (this.props.onAddMarkup) {
        this.props.onAddMarkup({ url:url });
        this.setState({ fieldValue:'' });
      }
    }
  },

  isSearch: function () {
    //console.log(this.state.fieldValue);
    var match = this.state.fieldValue.match(/^https?:\/\/.*/);
    if (Array.isArray(match) && match.length > 0) {
      //console.log('is search ! ');
      return false;
    } else return true;
  },

  render: function () {
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

  getInitialState: function () {
    return {
      fieldValue: '',
      buttonText: 'stack it !',
    };
  },
});

module.exports = AddMarkupForm;
