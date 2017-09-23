import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'
import {ADD_EVENT, CREATE_BELIEFSYSTEM} from '../actions/BeliefSystemActions'

export const ON_NEW_EVENT = "onNewEvent"
export const ON_NEW_CREATED = "onNewCreated"

class BeliefSystemStore extends EventEmitter {
  constructor(props) {
    super(props)
    this.beliefSystems = [
    ]
    this.currentBeliefSystem = null
  }

  createBeliefSystem( title ) {
    var beliefSystem = {
      id : Date.now(),
      title,
      events : [],
    }

    this.beliefSystems.push(beliefSystem)
    return beliefSystem
  }

  addEvent( name ) {
    var event = {
      id : Date.now(),
      name: name,
      position: {
        x: 100,
        y: 100
      },
      isBoolean: true
    }

    this.currentBeliefSystem.events.push(event)
    this.emit(ON_NEW_EVENT)
  }

  getAll() {
    return this.beliefSystemStore
  }

  getCurrent() {
    return this.currentBeliefSystem
  }

  handleActions(action) {
    switch(action.type) {
      case CREATE_BELIEFSYSTEM:
        var beliefSystem = this.createBeliefSystem(action.title)
        this.currentBeliefSystem = beliefSystem
        this.emit(ON_NEW_CREATED)
        break
      case ADD_EVENT:
        this.addEvent(action.name)
        break
      default :
        break
    }
    console.log("BeliefSystemStore received an action", action);
  }
}

const beliefSystemStore = new BeliefSystemStore()
dispatcher.register( beliefSystemStore.handleActions.bind(beliefSystemStore))

export default beliefSystemStore
