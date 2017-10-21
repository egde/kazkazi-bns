import React, { Component } from 'react'
import axios from 'axios'

class About extends Component {

  constructor() {
    super()
    this.state = {
      lastBuild : null,
      lastCommit: null,
      version : null
    }
  }

  componentWillMount() {
    axios.get('versions.json').then( (response) => {
      this.setState(response.data)
    })
  }

  render() {
    return (
      <div id="about" className="row">
        <div className="main">
          <div className="page-header"><h1>About Kazkazi-BNS</h1></div>
          <p>Kazkazi BNS is a tool for modelling your own Bayesian Network</p>

          <h2>Code</h2>
          <p>This webapp is being developed by myself in my free time. The code can be found on <a href="https://github.com/egde/kazkazi-bns">github</a>.</p>

          <h2>Current Build</h2>
          <table className="table-bordered">
            <tbody>
            <tr>
              <td>Version</td>
              <td>{ this.state.version }</td>
            </tr>
            <tr>
              <td>Last build</td>
              <td>{ new Date(this.state.lastBuild).toLocaleString() }</td>
            </tr>
            <tr>
              <td>Last Commit</td>
              <td><pre>{ this.state.lastCommit }</pre></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default About;
