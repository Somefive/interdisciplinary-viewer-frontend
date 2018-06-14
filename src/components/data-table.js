import React, { Component } from 'react'
import './data-table.css'
import axios from 'axios'
import { capitalize } from '../utils'

export default class DataTable extends Component {

  LOAD_LIMIT = 25;

  constructor(props) {
    super(props)
    this.state = {
      more: false,
      data: [],
      loading: false
    }
  }
  render() {
    const formatNumber = (number) => { return Math.abs(number) > 0.001 ? Number(number).toFixed(3) : Number(number).toExponential(2) }
    return (
      <div className="data-table">
        <div className="data-table-content">
          <div className="title">{this.props.title}</div>
          {this.props.data.map((value, index) => {
            return <div className="entry" key={index} onClick={() => this.notify(value[1])}>#{index+1}: {capitalize(value[1])}, {formatNumber(value[0])}</div>
          })}
        </div>
        <div className="more" onClick={this.displayMore}>More</div>
        <div className="modal scrollbar" style={{ opacity: this.state.more ? 1.0 : 0, zIndex: this.state.more ? 50 : -50 }} onClick={() => {this.setState({more: false})}}>
          <div className="container">
            <div className="title">{this.props.title}</div>
            {this.state.data.map((value, index) => {
              return <div className="entry" key={index} onClick={() => this.notify(value[1])}>#{index+1}: {capitalize(value[1])}, {formatNumber(value[0])}</div>
            })}
            <div className="more" onClick={(e) => {this.loadMore(); e.stopPropagation();}}>{this.state.loading ? 'Loading' : 'More'}</div>
          </div>
        </div>
      </div>
    )
  }
  displayMore = () => {
    this.setState({ more: true })
    if (this.state.data.length === 0) this.loadMore()
  }
  loadMore = () => {
    if (this.state.loading) return
    this.setState({ loading: true })
    let skip = this.state.data.length
    axios.get(this.props.url + `/${skip}/${this.LOAD_LIMIT}/${this.props.subParam || '0'}`).then((resp) => {
      this.setState({ data: [...this.state.data, ...resp.data], loading: false })
    }).catch((err) => {
      console.error(err)
      this.setState({ loading: false })
    })
  }
  notify = (name) => {
    if (this.props.loadSecond) this.props.loadSecond(name)
  }
}