'use strict'

import * as React from 'react'
import Timeline from './timeline'
import HttpDetail from './http-detail'
import * as data from '../data/data'
import event from '../../utils/event'

export interface NetworkState {
  timeline?: data.Detail[]
  detailId?: string
  detail?: data.MixedDetail
}

export default class Network extends React.Component<any, NetworkState> {

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
      detailId: id
    })
  }

  render() {
    return (
      <div className="network">
        <div className="list">
          <Timeline data={this.state.timeline}/>
        </div>
        <div className="main">
          <HttpDetail data={this.state.detail} />
        </div>
      </div>
    )
  }

}
