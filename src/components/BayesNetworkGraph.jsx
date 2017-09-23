import React, { Component } from 'react'

import { select } from 'd3-selection'
import './BayesNetworkGraph.css'

class BayesNetworkGraph extends Component {
  constructor(props) {
    super(props)
    this.createGraph = this.createGraph.bind(this)
  }

  componentDidMount() {
    this.createGraph()
  }

  componentDidUpdate() {
    this.createGraph()
  }

  createGraph() {
    const node = this.node
    if (this.props.data && this.props.data.events) {

      var eventNodes = select(node)
        .selectAll("circle")
        .data(this.props.data.events)
        .enter()
        .append("circle")

      eventNodes
        .attr("r", 10)
        .attr("cx", (dataValue) => {return dataValue.position.x})
        .attr("cy", (dataValue) => {return dataValue.position.y})

    }
  }

  render() {
      return <svg ref={node => this.node = node}
      width={960} height={500}>
      </svg>
   }
}

export default BayesNetworkGraph
