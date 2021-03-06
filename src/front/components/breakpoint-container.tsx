'use strict'

import * as React from 'react'
import { BreakPointTimeLine, TimelineRole } from './timeline'
import data, { DetailWithBody } from '../data/data'
import { IpcHTTPData } from '../../typed/typed'
import { autobind } from '../../utils/decorators'
import Editor from './breakpoint-editor'
import { Request, Response } from 'catro'

import './breakpoint-container.less'

export interface BreakpointState {
  detail?: DetailWithBody
}

export default class Breakpoint extends React.Component<any, BreakpointState> {

  constructor(props) {
    super(props)

    this.state = {}

    this.listenEvents()
  }

  listenEvents() {
    data.on('breakpoint-update', () => this.setState(this.state))
    data.on('breakpoint-rm', () => this.setState(this.state))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState
  }

  @autobind
  handleListClick(item: IpcHTTPData) {
    this.setState({
      detail: data.getBreakPoint(item.id, item.breakpoint)
    })
  }

  @autobind
  handleEditorSubmit(formData: Request | Response) {
    const detail = this.state.detail
    data.closeBreakPoint(detail.id, detail.breakpoint, formData)
    this.setState({
      detail: null
    })
  }

  render() {
    return (
      <div className="breakpoint">
        <div className="list">
          <BreakPointTimeLine data={data.breakpoints} role={TimelineRole.breakpoint} onClick={this.handleListClick}/>
        </div>
        {
          this.state.detail ? <Editor data={this.state.detail} onSubmit={this.handleEditorSubmit}/> : null
        }
      </div>
    )
  }

}
