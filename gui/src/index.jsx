'use strict'

let React = require('react')
let Timeline = require('./components/timeline')
let HttpDetail = require('./components/http-detail')
let data = require('./data/data')
let event = require('./utils/event')

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
    event.on('timeline-update', () => {
      let timeline = data.getTimeline()
      this.setState({
        timeline
      })
    })

    event.on('timeline-item-click', item => {
      this.setState({
        detailId: item.id
      })
    })
  }

  render() {
    return (
      <div className="layout">
        <aside>
          <Timeline data={this.state.timeline}/>
        </aside>
        <div className="main">
          <HttpDetail id={this.state.detailId} />
        </div>
      </div>
    )
  }
}

React.render(<Main/>, document.getElementById('target'))
