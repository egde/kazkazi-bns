import React, { Component } from 'react'
import * as BeliefSystemActions from '../actions/BeliefSystemActions'

import GraphStore, {ON_UPDATE_GRAPHMODE} from '../stores/GraphStore'
import * as DomUtils from '../utils/DomUtils'

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
    console.log("BeliefSyste:", this.props.data)
    this.createGraph()
  }

  componentWillUnmount() {
    GraphStore.removeListener(ON_UPDATE_GRAPHMODE, this.updateGraphMode)
  }

  createGraph() {
    const node = this.node

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    if (this.props.data && this.props.data.events) {
      var evnts = d3.select(node)
        .selectAll("circle")
        .data(this.props.data.events)

      evnts.enter()
          .append("circle")
          .attr("r", 10)
          .on("mouseover", function(dataValue) {
            d3.select(this).classed("highlight", true)

            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(dataValue.name)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
          })
          .on("mouseout", function() {
            d3.select(this).classed("highlight", false)

            div.transition()
                .duration(200)
                .style("opacity", 0);
          })
        .merge(evnts)
          .attr("cx", (dataValue) => {
            return dataValue.position.x})
          .attr("cy", (dataValue) => {
            return dataValue.position.y})
          .attr("id", (dataValue) => {
            return dataValue.id})
        .exit()
          .remove()

      var ev = d3.select(node)
        .selectAll("circle")
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

      d3.select(node)
        .selectAll("line")
        .data(this.props.data.influences)
        .enter()
          .append("line")
          .attr("marker-end", "url(#triangle)")
          .attr("x1", (dataValue) => {
            var offset = calcOffset(this.props.data, dataValue.cause, dataValue.action)
            var eventCause = this.props.data.events.find((i) => {
              return i.id===dataValue.cause
            })

            return eventCause.position.x - offset.x
          })
          .attr("y1", (dataValue) => {
            var offset = calcOffset(this.props.data, dataValue.cause, dataValue.action)
            var eventCause = this.props.data.events.find((i) => {
              return i.id===dataValue.cause
            })

            return eventCause.position.y - offset.y
          })
          .attr("x2", (dataValue) => {
            var offset = calcOffset(this.props.data, dataValue.cause, dataValue.action)
            var eventAction = this.props.data.events.find((i) => {
              return i.id===dataValue.action
            })

            return eventAction.position.x + offset.x
          })
          .attr("y2", (dataValue) => {
            var offset = calcOffset(this.props.data, dataValue.cause, dataValue.action)
            var eventAction = this.props.data.events.find((i) => {
              return i.id===dataValue.action
            })

            return eventAction.position.y + offset.y
          })
        .exit()
          .remove()
    }

    function calcOffset(data, cause, action) {

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
        node.attr("cx", d.position.x = d3.mouse(this)[0])
          .attr("cy", d.position.y = d3.mouse(this)[1])

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

          offset = calcOffset2({x: d.position.x, y: d.position.y}, {x: x, y: y})
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

          offset = calcOffset2({x: d.position.x, y: d.position.y}, {x: x, y: y})
          line = lineAction.filter((d) => {
            return d.id === datumLineAction.id
          })

          line.attr('x2', d3.mouse(this)[0] - offset.x)
            .attr('y2', d3.mouse(this)[1] - offset.y)
            .attr('x1', x + offset.x)
            .attr('y1', y + offset.y)
            .attr("marker-end", "url(#triangle)")
        }
      }

      function dragEnded() {
        var eventNode = d3.select(this)
        eventNode.classed("active", false)
        BeliefSystemActions.updateEvent(eventNode.datum().id, eventNode.datum().name, eventNode.datum().position)
      }

    function dragStartedOnInfluencing(d) {
      var selected = d3.select(this).raise().classed("active", true)

      d3.select(node)
        .append("line")
        .attr("marker-end", "url(#triangle)")
        .attr("x1", parseFloat(selected.attr("cx")))
        .attr("y1", parseFloat(selected.attr("cy")))
        .attr("x2", d3.mouse(this)[0])
        .attr("y2", d3.mouse(this)[1])
        .attr("state", "new")
    }

    function draggedOnInfluencing(d) {
      d3.select(this)

      d3.selectAll("line[state=new]")
        .attr("x2", d3.mouse(this)[0])
        .attr("y2", d3.mouse(this)[1])
    }

    function dragEndedOnInfluencing(d) {
      var startNode = d3.select(this)
      startNode.classed("active", false)

      var mouse = {
        x: d3.mouse(this)[0],
        y: d3.mouse(this)[1]
      }

      var svg = document.getElementById("bayesNetworkGraph")
      var svgOffset = {
        x: DomUtils.getOffset(svg).left,
        y: DomUtils.getOffset(svg).top,
      }

      var dx = mouse.x - startNode.datum().position.x
      var dy = mouse.y - startNode.datum().position.y

      var dir = {
        x: (dx === 0 ? 0 : dx / Math.abs(dx)),
        y: (dy === 0 ? 0 : dy / Math.abs(dy))
      }

      var endNode = document.elementFromPoint(svgOffset.x+mouse.x+dir.x, svgOffset.y+mouse.y+dir.y)
      console.log("mouse is over : ", endNode)
      endNode = d3.select(endNode)

      var newInfluence = d3.selectAll("line[state=new]").attr("state", null)
      newInfluence.remove()
      if ((startNode.datum() != null) && (endNode.datum() != null)) {
        BeliefSystemActions.addInfluence(startNode.datum(), endNode.datum())
      }
    }
  }

  render() {
      return (
        <svg id="bayesNetworkGraph" ref={node => this.node = node}>
          <defs>
            <marker id="triangle" refX="14" refY="6" markerWidth="15" markerHeight="15" orient="auto">
              <path d="M 0 0 12 6 0 12 3 6" style={{fill:"black"}}></path>
            </marker>
          </defs>
        </svg>
      )
   }

   updateGraphMode() {
     this.setState({
       graphMode : GraphStore.getGraphStore().graphMode
     })
   }
}

export default BayesNetworkGraph
