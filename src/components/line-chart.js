import React, { Component } from 'react'
import { Chart, Global } from '@antv/g2'
import DataSet from '@antv/data-set'

Global.setTheme('dark')

export default class LineChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
    this.id = 'trend-chart'
  }
  render() {
    return (
      <div id={this.id} style={{ flex: 'auto', width: 'calc( 100% - 10px )', ...this.props.style}}/>
    )
  }
  componentDidMount() {
    this.el = document.getElementById(this.id)
    this.init()
  }
  init() {
    this.chart = new Chart({
      container: this.el,
      forceFit: true
    })
    this.chart.line().position('year*output').color('name').shape('smooth')
    this.chart.axis('output', { title: { offset: 50 } })
    this.chart.changeHeight(this.el.parentElement.clientHeight - 10)
  }
  dataProjector = (data, name) => {
    return data.map((value, index) => { return { year: index + 1988, output: Number(Number(value).toExponential(2)), name } })
  }
  updateData = () => {
    let data = this.dataProjector(this.props.data, this.props.first)
    if (this.props.secondData && this.props.secondData.length > 0 && this.props.second) 
      data = [...data, ...this.dataProjector(this.props.secondData, this.props.second)]
    if (this.props.crossData && this.props.crossData.length > 0 && this.props.second) 
      data = [...data, ...this.dataProjector(this.props.crossData, this.props.first + ',' + this.props.second)]
    this.chart.source(data, {
      output: {
        alias: 'Frequency'
      },
      year: {
        min: 1988,
        max: 2017
      }
    })
    this.chart.render()
    
    this.chart.changeHeight(this.el.parentElement.clientHeight - 10)
    this.chart.forceFit()
  }
}