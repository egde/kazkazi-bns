import React, {Component} from 'react'
import './SidebarEditor.css'

import NewEventModal from '../components/NewEventModal'

import BeliefSystemStore, {ON_NEW_CREATED, ON_NEW_EVENT, ON_UPDATE_EVENT} from '../stores/BeliefSystemStore'
import GraphStore from '../stores/GraphStore'
import * as GraphActions from '../actions/GraphActions'

class SidebarEditor extends Component {

  constructor(props) {
    super(props)

    this.state = {
      beliefSystem : BeliefSystemStore.getCurrent(),
      graphMode : GraphStore.getGraphStore().graphMode
    }

    this.getEvents = this.getEvents.bind(this)
    this.onClick_AddEvent = this.onClick_AddEvent.bind(this)
    this.onClick_SwitchGraphMode = this.onClick_SwitchGraphMode.bind(this)
  }

  componentWillMount() {
    BeliefSystemStore.on(ON_NEW_EVENT, this.getEvents)
    BeliefSystemStore.on(ON_NEW_CREATED, this.getEvents)
    BeliefSystemStore.on(ON_UPDATE_EVENT, this.getEvents)

  }

  componentWillUnmount() {
    BeliefSystemStore.removeListener(ON_NEW_EVENT, this.getEvents)
    BeliefSystemStore.removeListener(ON_NEW_CREATED, this.getEvents)
    BeliefSystemStore.removeListener(ON_UPDATE_EVENT, this.getEvents)
  }

  render() {
    function GraphModeIcon(props) {
      if (props.graphMode === "drag") {
        return <span className="glyphicon glyphicon glyphicon-move" aria-hidden="true"></span>
      } else {
        return <span className="glyphicon glyphicon-king" aria-hidden="true"></span>
      }
    }

    return (
      <div id="sidebarEditor" className="col-sm-3 col-md-2 sidebar">
        <div className="row btnMenu">
          <div className="btn-group btn-group-justified" role="group">
             <div className="btn-group" role="group">
              <button type="button" className="btn btn-default" disabled={!this.state.beliefSystem}>
                <span className="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
              </button>
            </div>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-default" disabled={!this.state.beliefSystem} onClick={this.onClick_AddEvent}>
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
              </button>
            </div>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-default" disabled={!this.state.beliefSystem} onClick={this.onClick_SwitchGraphMode}>
                <GraphModeIcon graphMode={this.state.graphMode}/>
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="list-group">
            {
              this.state.beliefSystem ? this.state.beliefSystem.events.map((event) => {
                return (
                  <a href="/event/{event.id}" className="list-group-item" key={event.id}>{event.name}</a>
                )
              }) : <p className="text-warning">No belief system selected</p>
            }
          </div>
        </div>

        <NewEventModal ref={(instance) => {this.newEventModal = instance}} />
      </div>
    )
  }

  getEvents() {
    this.setState({
      beliefSystem : BeliefSystemStore.getCurrent()
    })
  }

  onClick_AddEvent() {
    this.newEventModal.show()
  }

  onClick_SwitchGraphMode() {
    var graphMode = null
    if (this.state.graphMode === "influencing") {
      graphMode = "drag"
    } else {
      graphMode = "influencing"
    }

    this.setState({
      graphMode : graphMode
    })
    GraphActions.updateGraphMode(graphMode)
  }
}

export default SidebarEditor
