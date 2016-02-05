'use strict'

import * as React from 'react'
import Timeline from './timeline'
import { TimelineRole } from './timeline'
import data from '../data/data'
import { Detail, MixedDetail } from '../data/data'
import { autobind } from '../../utils/decorators'
import Editor from './breakpoint-editor'
import { Type } from '../../typed/typed'
import { Request, Response } from 'catro'
import * as storage from '../../utils/storage'

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
      if (item.breakpoint) {
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
      detail: data.getItem(item.id)
    })
  }

  @autobind
  handleEditorSubmit(data: Request | Response) {
    console.log(data)
    if (this.detailType === Type.request) {
      // storage.writeStream()
    }
    else {

    }
  }

  get detailType() {
    const detail = this.state.detail
    if (!detail) {
      return
    }
    return this.state.detail.response ? Type.response : Type.request
  }

  render() {
    return (
      <div className="breakpoint">
        <div className="list">
          <Timeline data={data.breakpoints} role={TimelineRole.breakpoint} onClick={this.handleListClick}/>
        </div>
        {
          this.state.detail ? <Editor data={this.state.detail} type={this.detailType} onSubmit={this.handleEditorSubmit}/> : null
        }

      </div>
    )
  }

}
