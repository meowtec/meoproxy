'use strict'

import * as React  from 'react'
import { clipboard, remote } from 'electron'
import Icon from '../base/icon'
import { Detail } from '../data/data'
import { autobind } from '../../utils/decorators'
import { Request, Response } from '../../typed/typed'

import './timeline.less'

const Menu = remote.Menu

export interface TimelineItemProps extends React.Props<any> {
  request: Request
  protocol: string
  response: Response
  active: boolean
  onClick(props: TimelineItemProps)
}

export interface TimelineItemState {}

export interface TimelineProps {
  data: Detail[]
  role?: TimelineRole
  onClick(item: Detail): void
}

export interface TimelineState {
  activeId: string
}

export enum TimelineRole {
  network,
  breakpoint
}

class TimelineItem extends React.Component<TimelineItemProps, TimelineItemState> {

  baseUrl: string

  constructor(props: TimelineItemProps) {
    super(props)

    let request = props.request
    let port = request.port
    let isDefaultPort = !port || port === '80'
    let baseUrl = props.protocol + '://' + request.hostname + (isDefaultPort ? '' : ':' + port)

    this.baseUrl = baseUrl
  }

  getFullUrl() {
    return this.baseUrl + this.props.request.path
  }

  render() {
    let props = this.props
    let request = props.request
    let response = props.response
    let status = response ? response.status : null

    return (
      <li onContextMenu={this.handleContextMenu}
          onClick={this.handleClick}
          className={props.active ? 'active' : ''}
        >
        <span className="method">{request.method}</span>
        <div className="url">
          <span className="host">{this.baseUrl}</span>
          <span className="path">{request.path}</span>
        </div>
        <span className="status">{status}</span>
      </li>
    )
  }

  @autobind
  handleContextMenu(e) {
    Menu.buildFromTemplate([{
      label: 'Copy Link Address',
      // submenu: [],
      click: () => {
        this.copy()
      }
    }]).popup(remote.getCurrentWindow())
  }

  @autobind
  handleClick() {
    this.props.onClick(this.props)
  }

  copy() {
    clipboard.writeText(this.getFullUrl(), 'selection')
  }

  static defaultProps: TimelineItemProps = {
    onClick() {},
    request: null,
    response: null,
    protocol: 'http',
    active: false
  }
}

export class Timeline extends React.Component<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props)

    this.state = {
      activeId: null
    }
  }

  uid(item: Detail) {
    return item.id
  }

  renderEmpty() {
    if (this.props.role === TimelineRole.breakpoint) {
      return (
        <div className="timeline empty">
          <Icon glyph="inbox" />
          <p>当前无断点请求</p>
        </div>
      )
    }
    else {
      return (
        <div className="timeline empty">
          Waiting for connect...
        </div>
      )
    }
  }

  renderList() {
    return (
      <ul className="timeline">
        {
          this.props.data.map(item => {
            const uid = this.uid(item)
            return (
              <TimelineItem key={uid} {...item} active={uid === this.state.activeId} onClick={this.handleItemClick}/>
            )
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

  @autobind
  handleItemClick(item) {
    this.setState({
      activeId: this.uid(item)
    })
    this.props.onClick(item)
  }

  static defaultProps: TimelineProps = {
    data: [],
    onClick() {}
  }
}

export class BreakPointTimeLine extends Timeline {

  uid(item: Detail) {
    return item.id + '_' + item.breakpoint
  }

}
