import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'

import {UPDATE_GRAPH_MODE} from '../actions/GraphActions'

export const ON_UPDATE_GRAPHMODE = "onGraphModeUpdated"

class GraphStore extends EventEmitter {
  constructor(props) {
    super(props)
    this.graphStore = {
      graphMode: "drag"
    }
  }

  getGraphStore() {
    return this.graphStore
  }

  updateGraphMode(graphMode) {
    this.graphStore.graphMode = graphMode
    this.emit(ON_UPDATE_GRAPHMODE)
  }

  handleActions(action) {
    switch(action.type) {
      case UPDATE_GRAPH_MODE:
        this.updateGraphMode(action.graphMode)
        break

      default :
        break
    }
  }
}

const graphStore = new GraphStore()
dispatcher.register( graphStore.handleActions.bind(graphStore))

export default graphStore
