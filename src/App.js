import React, { Component } from 'react'
import './App.css'
import './radar.css'
import './scrollbar.css'
import axios from 'axios'
import DataTable from './components/data-table'
import LineChart from './components/line-chart'
import TGChart from './components/tg-chart'
import { capitalize, generateRankLabel } from './utils'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      headerFocus: false,
      searchText: 'computer science',
      oldSearchText: '',
      recentTexts: ['computer science'],
      token: '404',
      entities: ['404', 'not found'],
      trends: [],
      pmi: [],
      pcc: [],
      strength: [],
      lf: [],
      tg: [],
      pmi_self: 0,
      pcc_self: 0,
      strength_self: [],
      lf_self: [],
      tg_self: [],
      _id: -1,
      second: {},
      cross: {}
    }
  }
  componentDidMount() {
    this.addRecentText('computer science')
    this.search()
  }
  search = () => {
    if (this.state.loading) return
    this.setState({loading: true})
    axios.get(`/hint/${this.state.searchText}`).then((resp => {
      if (!resp.data) {
        this.setState({ loading: false, searchText: '404 not found' })
      } else {
        this.addRecentText(resp.data['token'])
        this.setState({...resp.data})
        axios.get(`/analyze/${this.state._id}`).then((resp) => {
          this.setState({...this.state, ...resp.data, _id: this.state._id, second: {}, loading: false})
          this.update()
          if (this.state.oldSearchText.length > 0)
            this.loadSecond(this.state.oldSearchText)
          this.setState({oldSearchText: this.state.token})
        }).catch(() => {this.setState({loading: false})})
      }
    })).catch(() => {this.setState({loading: false})})
  }
  render() {
    // const rel = this.state.pmi_self > 0 
    //   ? (this.state.pcc_self > 0 ? ['green', 'Friendship'] : ['yellow', 'Tryst'])
    //   : (this.state.pcc_self > 0 ? ['purple', 'Arms Race'] : ['red', 'Head to head'])
    return (
      <div className="App">
        <div className="content">

          <div className="basic-information">
            <div className="left">
              <div className="label-container">
                <div className="label">
                  <div className="title">Pointwise Mutual Information</div>
                  <div className="value">{generateRankLabel(this.state.cross.pmi)}</div>
                </div>
                <div className="label">
                  <div className="title">Pearson Correlation Coefficient</div>
                  <div className="value">{generateRankLabel(this.state.cross.pcc)}</div>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="label-container">
                <div className="label">
                  <div className="title">Relation Strength</div>
                  <div className="value">{generateRankLabel(this.state.cross.strength)}</div>
                </div>
                <div className="label">
                  <div className="title">Leading Factor</div>
                  <div className="value">{generateRankLabel(this.state.cross.lf)}</div>
                </div>
              </div>
              {/* <div className="label">
                <div className="title">Transition Gain</div>
                <div className="value scrollbar-small">{this.state.tg_self.slice(3, 27).map((v, i) => `${i+1991} ${generateRankLabel(v)}`).join(', ')}</div>
              </div> */}
            </div>
          </div>

          <div className={['header', this.state.headerFocus ? 'focus' : 'unfocus'].join(' ')}>
            <div className="search-title">What do you want to know?</div>
            <input className="search-input" value={this.state.searchText}
                   onChange={(e) => this.setState({searchText: e.target.value.toLowerCase()})}
                   onKeyPress={(e) => { if (e.key == 'Enter') this.search() }}/>
            <div className="search-recent">{ this.state.recentTexts.map((v, i) => {
              return <span key={i} onClick={() => { this.addRecentText(v); this.search(); }}>{v}</span>
            })}</div>
            <span className="logo">Interdisciplinary Discovery v1.0</span>
          </div>

          <div className="shield">
            <div className="topic" onClick={this.headerFocus}>
              <div className="outline second">
                <div className="outline first">
                  <div className="outline zero">
                    <div className="radar"/>
                    <div className="radar-scanner" hidden={!this.state.loading}/>
                    <div className="center-circle">
                      <div className="token">{capitalize(this.state.token)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alias">
            <div className="content">
              Alias: { this.state.entities.map((entity, index) => {
                if (entity !== this.state.token)
                  return <span className="entity" key={index}>{entity}</span>
              })}
            </div>
          </div>

          <div className="main-panel">
            <div className="left-panel">
              <div className="standard-metrics-panel panel">
                <DataTable loadSecond={this.loadSecond} title="Pointwise Mutual Information" data={this.state.pmi} url={`/analyze/more/${this.state._id}/pmi`}/>
                <DataTable loadSecond={this.loadSecond} title="Pearson Correlation Coefficient" data={this.state.pcc} url={`/analyze/more/${this.state._id}/pcc`}/>
                <DataTable loadSecond={this.loadSecond} title="Relation Strength" data={this.state.strength} url={`/analyze/more/${this.state._id}/strength`}/>
                <DataTable loadSecond={this.loadSecond} title="Leading Factor" data={this.state.lf} url={`/analyze/more/${this.state._id}/lf`}/>
              </div>
              <div className="trend-panel panel">
                <LineChart ref={(chart) => { this.chart = chart } } data={this.state.trends}
                           first={this.state.token} crossData={this.state.cross.trends}
                           second={this.state.second.token} secondData={this.state.second.trends}/>
              </div>
            </div>
            <div className="right-panel">
              <div className="tg-panel panel scrollbar">
                {
                  this.state.tg.map((value, index) => {
                    if (index < 3 || index >= 27) return undefined
                    return <DataTable loadSecond={this.loadSecond} title={`Transition Gain at ${index + 1988}`} data={value} url={`/analyze/more/${this.state._id}/tg`} subParam={index} key={index}/>
                  })
                }
              </div>
              <div className="trend-panel panel">
                <TGChart ref={(chart) => { this.tgchart = chart } }
                         A={this.state.token} AData={this.state.tg_self.slice(3, 27)}
                         B={this.state.second.token} BData={this.state.second.trends && this.state.second.tg_self.slice(3, 27)}
                         ABData={this.state.second.token && this.state.cross.tg.slice(3,27).map(v => v.slice(0,2))}
                         BAData={this.state.cross.tg && this.state.cross.tg.slice(3,27).map(v => v.slice(2,4))}
                         /> 
                         {/* crossData={this.state.cross.trends}
                         second={this.state.second.token} secondData={this.state.second.trends}/> */}
              </div>
            </div>
          </div>
          
          {/* <div className="-topic">
            <h1>{this.state.token}</h1>
            <div className="entities"></div>
          </div>
          <div className="trend">
          </div> */}
        </div>
      </div>
    )
  }
  loadSecond = (name) => {
    if (!name) {
      this.setState({ second: {}, cross: {} })
      return
    }
    if (this.state.loading) return
    this.setState({loading: true})
    axios.get(`/hint/${name}`).then((resp) => {
      if (!resp.data) {
        this.setState({loading: false})
        return
      }
      let second = resp.data
      this.addRecentText(resp.data['token'])
      Promise.all([
        axios.get(`/analyze/${second._id}`),
        axios.get(`/analyze/${this.state._id}/${second._id}`)
      ]).then((resps) => {
        this.setState({ second: {...second, ...resps[0].data }, cross: resps[1].data, loading: false })
        this.update()
      }).catch(() => this.setState({loading: false}))
    })
  }
  addRecentText = (text) => {
    let texts = [text]
    for (let t of this.state.recentTexts) {
      if (t == text) continue
      texts.push(t)
      if (texts.length > 3) break
    }
    this.setState({
      searchText: text,
      recentTexts: texts
    })
  }
  update = () => {
    this.chart.updateData()
    this.tgchart.updateData()
  }
  headerFocus = () => {
    if (this.state.headerFocus) {
      this.setState({headerFocus: false})
      return
    }
    this.setState({headerFocus: true})
    setTimeout(() => this.setState({headerFocus: false}), 5000)
  }
}

export default App;
