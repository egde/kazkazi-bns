import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'
import {ADD_EVENT, CREATE_BELIEFSYSTEM,UPDATE_EVENT, ADD_INFLUENCE} from '../actions/BeliefSystemActions'

export const ON_NEW_EVENT = "onNewEvent"
export const ON_NEW_CREATED = "onNewCreated"
export const ON_UPDATE_EVENT = "onEventUpdated"
export const ON_INFLUENCE_ADDED = "onInfluenceAdded"

const TEST = {
  id: 1506756792575,
  title: "Bayern München",
  events: [
    {
      id: 1506756808939,
      name: "Letztes Spiel gewonnen",
      position: {
        x: 100,
        y:100
      },
      isBoolean: true
    },
    {
      id: 15067568082239,
      name: "Ribery verletzt",
      position: {
        x: 100,
        y:150
      },
      isBoolean: true
    },
    {
      id: 1506772736792,
      name: "Spiel verloren",
      position: {
        x: 150,
        y:150
      },
      isBoolean: true
    }
  ],
  influences: [
    {
      id:1,
      cause: 1506756808939,
      action: 1506772736792
    },
    {
      id:2,
      cause: 15067568082239,
      action: 1506772736792
    },
    {
      id:3,
      cause: 1506756808939,
      action: 15067568082239
    },
  ]
}

class BeliefSystemStore extends EventEmitter {
  constructor(props) {
    super(props)

    if (process.env.NODE_ENV === 'development') {
      this.beliefSystems = [ TEST
      ]
      this.currentBeliefSystem = TEST
    } else {
      this.beliefSystems = [ null
      ]
      this.currentBeliefSystem = null
    }
  }

  createBeliefSystem( title ) {
    var beliefSystem = {
      id : Date.now(),
      title,
      events : [],
      influences : []
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

  updateEvent(id, name, position) {
    var event = this.currentBeliefSystem.events.find( (i) => { return i.id === id} )
    event.name = name;
    event.position = position;

    this.emit(ON_UPDATE_EVENT)
  }

  addInfluence(cause, action) {
    var newInfluence = {
      id: Date.now(),
      cause: cause.id,
      action: action.id
    }

    this.currentBeliefSystem.influences.push(newInfluence)
    console.log("BeliefSystem is: ", this.currentBeliefSystem)
    this.emit(ON_INFLUENCE_ADDED)
  }

  getAll() {
    return this.beliefSystemStore
  }

  getCurrent() {
    return this.currentBeliefSystem
  }

  handleActions(action) {
    console.log("BeliefSystemStore received an action", action);
    switch(action.type) {
      case CREATE_BELIEFSYSTEM:
        var beliefSystem = this.createBeliefSystem(action.title)
        this.currentBeliefSystem = beliefSystem
        this.emit(ON_NEW_CREATED)
        break
      case ADD_EVENT:
        this.addEvent(action.name)
        break
      case UPDATE_EVENT:
        this.updateEvent(action.id, action.name, action.position)
        break
      case ADD_INFLUENCE:
        this.addInfluence(action.cause, action.action)
        break
      default :
        break
    }
  }
}

const beliefSystemStore = new BeliefSystemStore()
dispatcher.register( beliefSystemStore.handleActions.bind(beliefSystemStore))

export default beliefSystemStore
