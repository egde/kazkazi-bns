import React, {Component} from 'react'
import './SidebarEditor.css'

import NewEventModal from '../components/NewEventModal'

import BeliefSystemStore, {ON_NEW_CREATED, ON_NEW_EVENT} from '../stores/BeliefSystemStore'

class SidebarEditor extends Component {

  constructor(props) {
    super(props)

    this.state = {
      beliefSystem : null
    }

    this.getEvents = this.getEvents.bind(this)
    this.onClick_AddEvent = this.onClick_AddEvent.bind(this)
  }

  componentWillMount() {
    BeliefSystemStore.on(ON_NEW_EVENT, this.getEvents)
    BeliefSystemStore.on(ON_NEW_CREATED, this.getEvents)
  }

  componentWillUnmount() {
    BeliefSystemStore.removeListener(ON_NEW_EVENT, this.getEvents)
    BeliefSystemStore.removeListener(ON_NEW_CREATED, this.getEvents)
  }

  render() {
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
}

export default SidebarEditor
