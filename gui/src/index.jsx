'use strict'

let React = require('react')
let Timeline = require('./components/timeline')
let HttpDetail = require('./components/http-detail')
let data = require('./data/data')
let event = require('./utils/event')
let assert = require('assert')
let __ = require('lodash')

// let TimelineMockData = require('./data/timeline-mock')

require('./css/index.less')

class Main extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      timeline: data.getTimeline()
    }

    this.listenEvents()
  }

  listenEvents() {
    // 监听 tineline 数据的更新
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
      assert(__.isString(item.id), 'timeline-item-click 回调函数的 item.id 必须是字符串，现在是 ${item.id}')
      this.updateDetail(item.id)
    })
  }

  updateDetail(id) {
    let detailId = id || this.state.detailId
    let detail = data.getItem(detailId)
    this.setState({
      detail,
      detailId
    })
  }

  render() {
    console.log(this.state.detail)
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

React.render(<Main/>, document.getElementById('target'))
