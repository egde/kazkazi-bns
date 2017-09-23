import React, { Component } from 'react'

import SidebarEditor from '../components/SidebarEditor'
import BeliefSystemMainView from '../components/BeliefSystemMainView'

class Home extends Component {
  render() {
    return (
      <div id="home" className="row">
        <SidebarEditor/>
        <BeliefSystemMainView/>
      </div>
    )
  }
}

export default Home
