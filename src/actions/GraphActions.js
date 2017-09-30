import dispatcher from '../Dispatcher'

export const UPDATE_GRAPH_MODE = "UPDATE_GRAPH_MODE"

export function updateGraphMode(graphMode) {
  dispatcher.dispatch({
    type: UPDATE_GRAPH_MODE,
    graphMode,
  })
}
