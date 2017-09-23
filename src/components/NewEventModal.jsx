import React, {Component} from 'react'
import * as BeliefSystemActions from '../actions/BeliefSystemActions'

class NewEventModal extends Component{
  constructor(props) {
    super(props)

    this.state = {
      showNewEventModal: this.props.show,
      eventName : ""
    }

    this.show = this.show.bind(this)
    this.close = this.close.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onClick_Create = this.onClick_Create.bind(this)
  }

  render() {
    return (
      <div className={this.state.showNewEventModal
        ? "modal show"
        : "modal fade"} id="modalNewBeliefSystem" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.close}>&times;</button>
              <h4>Create new Event</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="txtTitle">Event Name</label>
                  <input type="text" className="form-control" id="txtTitle" name="eventName" placeholder="Name of your event" value={this.state.eventName} onChange={this.handleChange}/>
                </div>
                <button type="submit" className="btn btn-success btn-block" onClick={this.onClick_Create}>Create</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-default pull-left" onClick={this.close}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  show() {
    this.setState({showNewEventModal: true})
  }

  close() {
    this.setState({showNewEventModal: false})
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var state = this.state;
    state[name] = value;

    this.setState(state);
  }

  onClick_Create(e) {
    e.preventDefault()
    BeliefSystemActions.addEvent(this.state.eventName)
    this.close()
  }
}

export default NewEventModal
