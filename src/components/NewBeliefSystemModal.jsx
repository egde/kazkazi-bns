import React, {Component} from 'react'
import * as BeliefSystemActions from '../actions/BeliefSystemActions'

class NewBeliefSystemModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModalNewBeliefSystem: props.show,
      title: "",
    }

    this.close = this.close.bind(this)
    this.show = this.show.bind(this)
    this.onCreateClick = this.onCreateClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    return (
      <div className={this.state.showModalNewBeliefSystem
        ? "modal show"
        : "modal fade"} id="modalNewBeliefSystem" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.close}>&times;</button>
              <h4>Create new Belief System</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="txtTitle">Title</label>
                  <input type="text" className="form-control" id="txtTitle" name="title" placeholder="Title of the Belief System" value={this.state.title} onChange={this.handleChange}/>
                </div>
                <button type="submit" className="btn btn-success btn-block" onClick={this.onCreateClick}>Create</button>
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
    this.setState({showModalNewBeliefSystem: true})
  }

  close() {
    this.setState({showModalNewBeliefSystem: false})
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var state = this.state;
    state[name] = value;

    this.setState(state);
  }

  onCreateClick(e) {
    e.preventDefault()
    BeliefSystemActions.createBeliefSystem(this.state.title)
    this.close()
  }
}

export default NewBeliefSystemModal
