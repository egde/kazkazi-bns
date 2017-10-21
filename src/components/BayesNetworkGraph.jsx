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

    d3.select(node)
      .append("svg:defs")
      .append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", 14)
        .attr("refY", 6)
        .attr("markerWidth", 15)
        .attr("markerHeight", 15)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "black")

    if (this.props.data && this.props.data.events) {
      var data = this.props.data

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
          .on("start", dragStartedOnInfluencing)
          .on("drag", draggedOnInfluencing)
          .on("end", dragEndedOnInfluencing))
      }

      eventNodes
        .attr("r", 10)
        .attr("cx", (dataValue) => {return dataValue.position.x})
        .attr("cy", (dataValue) => {return dataValue.position.y})
        .attr("id", (dataValue) => {return dataValue.id})
        .on("mouseover", function() {
          d3.select(this).classed("highlight", true)
        })
        .on("mouseout", function() {
          d3.select(this).classed("highlight", false)
        })

      var influenceEdges = d3.select(node)
        .selectAll("line")
        .data(this.props.data.influences)
        .enter()
        .append("line")
        .attr("marker-end", "url(#triangle)")

      influenceEdges
        .attr("x1", (dataValue) => {
          var offset = calcOffset(dataValue.cause, dataValue.action)
          var eventCause = this.props.data.events.find((i) => {
            return i.id===dataValue.cause
          })

          return eventCause.position.x - offset.x
        })
        .attr("y1", (dataValue) => {
          var offset = calcOffset(dataValue.cause, dataValue.action)
          var eventCause = this.props.data.events.find((i) => {
            return i.id===dataValue.cause
          })

          return eventCause.position.y - offset.y
        })
        .attr("x2", (dataValue) => {
          var offset = calcOffset(dataValue.cause, dataValue.action)
          var eventAction = this.props.data.events.find((i) => {
            return i.id===dataValue.action
          })

          return eventAction.position.x + offset.x
        })
        .attr("y2", (dataValue) => {
          var offset = calcOffset(dataValue.cause, dataValue.action)
          var eventAction = this.props.data.events.find((i) => {
            return i.id===dataValue.action
          })

          return eventAction.position.y + offset.y
        })

      function calcOffset(cause, action) {

        var eventCause = data.events.find((i) => {
          return i.id===cause
        })
        var eventAction = data.events.find((i) => {
          return i.id===action
        })

        var pos1 = {x: eventCause.position.x, y: eventCause.position.y}
        var pos2 = {x: eventAction.position.x, y: eventAction.position.y}

        return calcOffset2(pos1, pos2)
      }

      function calcOffset2(pos1, pos2) {
        var result = { x: 0, y: 0 }
        var diffX =  pos1.x - pos2.x
        var diffY =  pos1.y - pos2.y

        var distance = Math.sqrt(diffX*diffX + diffY*diffY)
        result.x = (diffX / distance * 10)
        result.y = (diffY / distance * 10)

        return result
      }

      function dragStarted(d) {
        d3.select(this).raise().classed("active", true);
      }

      function dragged(d) {
          var node = d3.select(this)
          node.attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y)

          var lineCause = d3.selectAll("line").filter((d, i) => {
            return d.cause === node.datum().id
          })

          var lineAction = d3.selectAll("line").filter((d, i) => {
            return d.action === node.datum().id
          })

          var node2 = null
          var x, y, line, offset
          for (var iLineCause in lineCause.data() ) {
            var datumLineCause = lineCause.data()[iLineCause]
            node2 = d3.selectAll("circle").filter((d) => {
              var id = datumLineCause.action
              return d.id === id
            })

            x = parseFloat(node2.attr('cx'))
            y = parseFloat(node2.attr('cy'))

            offset = calcOffset2({x: d.x, y: d.y}, {x: x, y: y})
            line = lineCause.filter((d) => {
              return d.id === datumLineCause.id
            })

            line.attr('x1', d3.event.x - offset.x)
              .attr('y1', d3.event.y - offset.y)
              .attr('x2', x + offset.x)
              .attr('y2', y + offset.y)
              .attr("marker-end", "url(#triangle)")
          }

          for (var iLineAction in lineAction.data() ) {
            var datumLineAction = lineAction.data()[iLineAction]

            node2 = d3.selectAll("circle").filter((d) => {
              var id = datumLineAction.cause
              return d.id === id
            })

            x = parseFloat(node2.attr('cx'))
            y = parseFloat(node2.attr('cy'))

            offset = calcOffset2({x: d.x, y: d.y}, {x: x, y: y})
            line = lineAction.filter((d) => {
              return d.id === datumLineAction.id
            })

            line.attr('x2', d3.event.x - offset.x)
              .attr('y2', d3.event.y - offset.y)
              .attr('x1', x + offset.x)
              .attr('y1', y + offset.y)
              .attr("marker-end", "url(#triangle)")
          }
      }
      
      function dragEnded() {
        var eventNode = d3.select(this)
        eventNode.classed("active", false)
        BeliefSystemActions.updateEvent(eventNode.datum().id, eventNode.datum().name, {x: eventNode.datum().x, y: eventNode.datum().y})
      }

      function dragStartedOnInfluencing(d) {
        var selected = d3.select(this).raise().classed("active", true)

        var newInfluence = d3.select(node)
          .append("line")
          .attr("marker-end", "url(#triangle)")
          .attr("x1", parseFloat(selected.attr("cx")))
          .attr("y1", parseFloat(selected.attr("cy")))
          .attr("state", "new")
      }

      function draggedOnInfluencing(d) {
        var node = d3.select(this)

        var newInfluence = d3.selectAll("line[state=new]")
          .attr("x2", d3.event.x)
          .attr("y2", d3.event.y)
      }

      function dragEndedOnInfluencing(d) {
        var startNode = d3.select(this)
        startNode.classed("active", false)
        var newInfluence = d3.selectAll("line[state=new]")
        newInfluence.attr("state", null)
        
      }
    }
  }

  render() {
      return <svg ref={node => this.node = node}>
      </svg>
   }

   updateGraphMode() {
     this.setState({
       graphMode : GraphStore.getGraphStore().graphMode
     })
   }
}

export default BayesNetworkGraph
