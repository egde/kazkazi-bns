import React, {Component} from 'react'
import NewBeliefSystemModal from '../components/NewBeliefSystemModal'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModalNewBeliefSystem: false
    }

    this.onNewClick = this.onNewClick.bind(this)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">Kazkazi BNS</a>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="" onClick={this.onNewClick}>New</a>
                </li>
                <li>
                  <a href="">Load</a>
                </li>
                <li>
                  <a href="">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <NewBeliefSystemModal ref={(instance) => {this.newBeliefSystemModal = instance}}/>
      </div>
    )
  }

  onNewClick(e) {
    e.preventDefault()
    this.newBeliefSystemModal.show()
  }
}

export default Navbar
