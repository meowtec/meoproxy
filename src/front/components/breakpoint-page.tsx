'use strict'

import * as React from 'react'
import Timeline from './timeline'
import { TimelineRole } from './timeline'
import data from '../data/data'
import { Detail, MixedDetail } from '../data/data'
import { autobind } from '../../utils/decorators'
import Editor from './breakpoint-editor'
import { Request, Response } from 'catro'

export interface BreakpointState {
  detail?: MixedDetail
}

export default class Breakpoint extends React.Component<any, BreakpointState> {

  constructor(props) {
    super(props)

    this.state = {}

    this.listenEvents()
  }

  listenEvents() {
    data.on('update', (item: Detail) => {
      if (item.breakpoint != null) {
        this.forceUpdate()
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState
  }

  @autobind
  handleListClick(item: Detail) {
    this.setState({
      detail: data.getBreakPoint(item.id, item.breakpoint)
    })
  }

  @autobind
  handleEditorSubmit(formData: Request | Response) {
    const detail = this.state.detail
    data.closeBreakPoint(detail.id, detail.breakpoint, formData)
  }

  render() {
    return (
      <div className="breakpoint">
        <div className="list">
          <Timeline data={data.breakpoints} role={TimelineRole.breakpoint} onClick={this.handleListClick}/>
        </div>
        {
          this.state.detail ? <Editor data={this.state.detail} onSubmit={this.handleEditorSubmit}/> : null
        }
      </div>
    )
  }

}
