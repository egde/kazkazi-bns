import dispatcher from '../Dispatcher'

export const CREATE_BELIEFSYSTEM = "CREATE_BELIEF-SYSTEM"
export const ADD_EVENT = "ADD_EVENT"
export const UPDATE_EVENT = "UPDATE_EVENT"
export const ADD_INFLUENCE = "ADD_INFLUENCE"

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

export function updateEvent(id, name, position) {
  dispatcher.dispatch({
    type: UPDATE_EVENT,
    id,
    name,
    position
  })
}

export function addInfluence(cause, action) {
  dispatcher.dispatch({
    type: ADD_INFLUENCE,
    cause,
    action
  })
}
