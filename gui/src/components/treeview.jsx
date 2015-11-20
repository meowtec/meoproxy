'use strict'

let React = require('react')
var remote = require('remote')
var Menu = remote.require('menu')
let clipboard = require('clipboard')
let event = require('../utils/event')

require('./timeline.less')

class TimelineItem extends React.Component {

  constructor(props) {
    super(props)

    let request = props.request
    let scheme = props.ssl ? 'https' : 'http'
    let port = request.port
    let isDefaultPort = !port || port === 80
    let host = scheme + '://' + request.hostname + (isDefaultPort ? '' : ':' + port)

    this.state = {
      host: host
    }

  }

  render() {
    let props = this.props
    let request = props.request
    let response = props.response || {}

    return (
      <li onContextMenu={this.handleContextMenu.bind(this)}
          onClick={this.handleClick.bind(this)}
          className={props.active ? 'active' : ''}
        >
        <div className="url">
          <span className="host">{this.state.host}</span>
          <span className="path">{request.path}</span>
        </div>
        <div className="aside">
          <span className="method">{request.method}</span>
          <span className="status">{response.status}</span>
        </div>
      </li>
    )
  }

  handleContextMenu(e) {
    Menu.buildFromTemplate([{
      label: 'Copy Link Address',
      // submenu: [],
      click: () => {
        this.copy()
      }
    }]).popup(remote.getCurrentWindow())
  }

  handleClick() {
    this.props.onClick(this.props)
  }

  copy() {
    clipboard.writeText(this.props.host + this.props.path, 'selection')
  }
}

TimelineItem.defaultProps = {
  onClick() {}
}

export default class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeId: null
    }
  }

  render() {
    return (
      <ul className="timeline">
        {
          this.props.data.map(item => {
            return <TimelineItem key={item.id} {...item} active={item.id === this.state.activeId} onClick={this.handleItemClick.bind(this)}/>
          })
        }
      </ul>
    )
  }

  handleItemClick(item) {
    this.setState({
      activeId: item.id
    })
    event.emit('timeline-item-click', item)
  }
}

Timeline.defaultProps = {
  data: []
}
