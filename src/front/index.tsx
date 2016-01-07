'use strict'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Timeline from './components/timeline'
import HttpDetail from './components/http-detail'
import * as data from './data/data'
import event from '../utils/event'
import * as assert from 'assert'
import * as __ from 'lodash'

// require('./css/index.less')

class Main extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      timeline: data.getTimeline()
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

  render() {
    return (
      <div className="layout">
        <aside>
          <Timeline data={this.state.timeline}/>
        </aside>
        <div className="main">
          <HttpDetail data={this.state.detail} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('target'))
