import dispatcher from '../Dispatcher'

export const CREATE_BELIEFSYSTEM = "CREATE_BELIEF-SYSTEM"
export const ADD_EVENT = "ADD_EVENT"

export function createBeliefSystem(title) {
  dispatcher.dispatch({
    type: CREATE_BELIEFSYSTEM,
    title,
  })
}

export function addEvent(name) {
  dispatcher.dispatch({
    type: ADD_EVENT,
    name,
  })
}
