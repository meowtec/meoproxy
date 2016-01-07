'use strict'

import * as React  from 'react'
import { clipboard, remote, Menu } from 'electron'
import event from '../../utils/event'


export interface TimelineItemProps extends React.Props<any> {
  request: any
  ssl: boolean
  response: any
  active: boolean
  onClick(props: TimelineItemProps)
}

export interface TimelineItemState {}

export interface TimelineProps {
  data: any[]
}

export interface TimelineState {
  activeId: string
}


class TimelineItem extends React.Component<TimelineItemProps, TimelineItemState> {

  constructor(props: TimelineItemProps) {
    super(props)

    let request = props.request
    let scheme = props.ssl ? 'https' : 'http'
    let port = request.port
    let isDefaultPort = !port || port === 80
    let baseUrl = scheme + '://' + request.hostname + (isDefaultPort ? '' : ':' + port)

    this.baseUrl = baseUrl
  }

  baseUrl: string

  getFullUrl() {
    return this.baseUrl + this.props.request.path
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
          <span className="host">{this.baseUrl}</span>
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
    clipboard.writeText(this.getFullUrl(), 'selection')
  }

  static defaultProps: TimelineItemProps = {
    onClick() {},
    request: {},
    response: {},
    ssl: false,
    active: false
  }
}

export default class Timeline extends React.Component<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props)

    this.state = {
      activeId: null
    }
  }

  renderEmpty() {
    return (
      <div className="timeline empty">
        Waiting for connect...
      </div>
    )
  }

  renderList() {
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

  render() {
    if (this.props.data.length) {
      return this.renderList()
    }
    else {
      return this.renderEmpty()
    }
  }

  handleItemClick(item) {
    this.setState({
      activeId: item.id
    })
    event.emit('timeline-item-click', item)
  }

  static defaultProps: TimelineProps = {
    data: []
  }
}
