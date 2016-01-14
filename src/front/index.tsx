'use strict'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Timeline from './components/timeline'
import HttpDetail from './components/http-detail'
import { Page, PageItem } from './components/pages'
import { Tab, TabItem } from './components/tabs'
import * as data from './data/data'
import event from '../utils/event'

class Main extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      timeline: data.getTimeline(),
      navValue: 'network'
    }

    this.listenEvents()
  }

  listenEvents() {
    // 监听 timeline 数据的更新
    event.on('timeline-update', item => {
      // 更新到最新的 timeline
      let timeline = data.getTimeline()
      this.setState({
        timeline
      })

      // 如果发生更新的数据和当前详情的数据一致，则更新详情
      if (item.id === this.state.detailId) {
        this.updateDetail()
      }
    })

    event.on('timeline-item-click', item => {
      this.updateDetail(item.id)
    })
  }

  updateDetail(id?) {
    id = id || this.state.detailId
    let detail = data.getItem(id)
    this.setState({
      detail,
      id
    })
  }

  handleMainNavChange(value: string) {
    this.setState({
      navValue: value
    })
  }

  render() {
    return (
      <div className="layout">
        <Tab className="nav" defaultValue={this.state.navValue} onChange={this.handleMainNavChange.bind(this)}>
          <TabItem value="network">
            <i className="oi" data-glyph="transfer"/>
            Network
          </TabItem>
          <TabItem value="sequence">
            <i className="oi" data-glyph="layers"/>
            Sequence
          </TabItem>
          <TabItem value="breakpoints">
            <i className="oi" data-glyph="target"/>
            Breakpoints
            <span className="dot">12</span>
          </TabItem>
        </Tab>
        <Page value={this.state.navValue} className="body">
          <PageItem value="network" className="network">
            <div className="list">
              <Timeline data={this.state.timeline}/>
            </div>
            <div className="main">
              <HttpDetail data={this.state.detail} />
            </div>
          </PageItem>
          <PageItem value="sequence">
            seq
          </PageItem>
          <PageItem value="breakpoints">
            bk
          </PageItem>
        </Page>
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('target'))
