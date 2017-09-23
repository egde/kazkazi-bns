import React, {Component} from 'react'

import NewBeliefSystemModal from '../components/NewBeliefSystemModal'
import BayesNetworkGraph from '../components/BayesNetworkGraph'

import BeliefSystemStore, {ON_NEW_CREATED, ON_NEW_EVENT} from '../stores/BeliefSystemStore'

class BeliefSystemMainView extends Component {
  constructor() {
    super()
    this.state = {
      beliefSystem: BeliefSystemStore.getCurrent()
    }
    this.getCurrentBeliefSystem = this.getCurrentBeliefSystem.bind(this)
    this.onClick_createBeliefSystem = this.onClick_createBeliefSystem.bind(this)
  }

  componentWillMount() {
    BeliefSystemStore.on(ON_NEW_CREATED, this.getCurrentBeliefSystem)
    BeliefSystemStore.on(ON_NEW_EVENT, this.getCurrentBeliefSystem)
  }

  componentWillUnmount() {
    BeliefSystemStore.removeListener(ON_NEW_CREATED, this.getCurrentBeliefSystem)
    BeliefSystemStore.removeListener(ON_NEW_EVENT, this.getCurrentBeliefSystem)
  }

  getCurrentBeliefSystem() {
    this.setState({beliefSystem: BeliefSystemStore.getCurrent()})
  }
  render() {
    return (
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

        <div className="page-header">
          <h1>{this.state.beliefSystem
              ? this.state.beliefSystem.title
              : "No belief system selected"}</h1>
        </div>
        {this.state.beliefSystem
          ? <div className="row">
              <BayesNetworkGraph data={this.state.beliefSystem}/>
            </div>
          : <div className="row">
            <div className="text-center">
              <button className="btn btn-primary" onClick={this.onClick_createBeliefSystem}>Create belief system</button>
            </div>
            <NewBeliefSystemModal ref={(instance) => this.newBeliefSystemModal = instance}/>
          </div>
}
      </div>
    )
  }

  onClick_createBeliefSystem(e) {
    e.preventDefault()
    this.newBeliefSystemModal.show()
  }
}

export default BeliefSystemMainView
