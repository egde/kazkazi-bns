import React, {Component} from 'react';

class Footer extends Component {
  render() {
    return (
      <div className="navbar navbar-default navbar-fixed-bottom">
        <div className="container">
          <p className="navbar-text pull-left"><a href="/about">© { (new Date()).getFullYear() } Kazkazi</a>
          </p>
        </div>
      </div>
    )
  }
}

export default Footer
