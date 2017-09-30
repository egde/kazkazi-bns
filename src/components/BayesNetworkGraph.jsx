import React, { Component } from 'react'
import * as BeliefSystemActions from '../actions/BeliefSystemActions'

import GraphStore, {ON_UPDATE_GRAPHMODE} from '../stores/GraphStore'

import * as d3 from 'd3'
import './BayesNetworkGraph.css'

class BayesNetworkGraph extends Component {
  constructor(props) {
    super(props)
    this.createGraph = this.createGraph.bind(this)
    this.updateGraphMode = this.updateGraphMode.bind(this)

    this.state = {
      graphMode : GraphStore.getGraphStore().graphMode
    }
  }

  componentWillMount() {
    GraphStore.on(ON_UPDATE_GRAPHMODE, this.updateGraphMode)
  }

  componentDidMount() {
    this.createGraph()
  }

  componentDidUpdate() {
    this.createGraph()
  }

  componentWillUnmount() {
    GraphStore.removeListener(ON_UPDATE_GRAPHMODE, this.updateGraphMode)
  }

  createGraph() {
    const node = this.node

    if (this.props.data && this.props.data.events) {

      var eventNodes = d3.select(node)
        .selectAll("circle")
        .data(this.props.data.events)
        .enter()
        .append("circle")
      var ev = d3.select(node)
        .selectAll("circle");
      if (this.state.graphMode === "drag") {
        ev.call(d3.drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded))
      } else {
        ev.call(d3.drag()
          .on("start", null)
          .on("drag", null)
          .on("end", null))
      }

      eventNodes
        .attr("r", 10)
        .attr("cx", (dataValue) => {return dataValue.position.x})
        .attr("cy", (dataValue) => {return dataValue.position.y})

      function dragStarted(d) {
        d3.select(this).raise().classed("active", true);
      }

      function doNothing() {
        console.log("Do nothing!")
      }

      function dragged(d) {
          d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y)
      }

      function dragEnded() {
        var eventNode = d3.select(this)
        eventNode.classed("active", false);
        BeliefSystemActions.updateEvent(eventNode.datum().id, eventNode.datum().name, {x: eventNode.datum().x, y: eventNode.datum().y})
      }
    }
  }

  render() {
      return <svg ref={node => this.node = node}
      width={960} height={500}>
      </svg>
   }

   updateGraphMode() {
     this.setState({
       graphMode : GraphStore.getGraphStore().graphMode
     })
   }
}

export default BayesNetworkGraph
