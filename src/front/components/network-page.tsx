'use strict'

import * as React from 'react'
import Timeline from './timeline'
import HttpDetail from './http-detail'
import data from '../data/data'
import { MixedDetail, Detail } from '../data/data'
import { autobind } from '../../utils/decorators'

export interface NetworkState {
  detailId?: string;
  detail?: MixedDetail;
}

export default class Network extends React.Component<any, NetworkState> {

constructor(props) {
    super(props)

    this.state = {
    }

    this.listenEvents()
  }

  listenEvents() {
    // 监听 timeline 数据的更新
    data.on('update', (item: Detail) => {
      // 如果发生更新的数据和当前详情的数据一致，则更新详情
      if (item.id === this.state.detailId) {
        this.updateDetail()
      }
      else {
        this.forceUpdate()
      }
    })
  }

  @autobind
  handleTimelineClick(item) {
    this.updateDetail(item.id)
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
          <Timeline data={data.timeline} onClick={this.handleTimelineClick}/>
        </div>
        <div className="main">
          <HttpDetail data={this.state.detail} />
        </div>
      </div>
    )
  }

}
