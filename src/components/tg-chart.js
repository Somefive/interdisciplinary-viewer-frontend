import React, { Component } from 'react'
import { Chart, Global } from '@antv/g2'

Global.setTheme('dark')

export default class TGChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
    this.id = 'tg-chart'
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
    this.chart.line().position('year*output').color('name').shape('smooth').tooltip('rank*tg')
    this.chart.axis('output', { title: { offset: 50 } })
    this.chart.changeHeight(this.el.parentElement.clientHeight - 10)
  }
  dataProjector = (data, name) => {
    return data.map((value, index) => { return { year: index + 1991, output: 2500 - value[1], rank: value[1] + 1, name, tg: Number(value[0]).toExponential(3) } })
  }
  updateData = () => {
    let data = this.dataProjector(this.props.AData, this.props.A)
    if (this.props.BData && this.props.BData.length > 0 && this.props.B) 
      data = [...data, ...this.dataProjector(this.props.BData, this.props.B)]
    if (this.props.ABData && this.props.ABData.length > 0 && this.props.B) 
      data = [...data, ...this.dataProjector(this.props.ABData, this.props.A + ' => ' + this.props.B)]
    if (this.props.BAData && this.props.BAData.length > 0 && this.props.B) 
      data = [...data, ...this.dataProjector(this.props.BAData, this.props.B + ' => ' + this.props.A)]
    this.chart.source(data, {
      output: {
        alias: 'Transition Gain Inverse Rank',
        min: 1,
        max: 2500
      },
      year: {
        min: 1991,
        max: 2014
      }
    })
    this.chart.render()
    
    this.chart.changeHeight(this.el.parentElement.clientHeight - 10)
    this.chart.forceFit()
  }
}