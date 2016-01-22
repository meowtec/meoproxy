'use strict'

import * as React from 'react'
import Timeline from './timeline'
import { TimelineRole } from './timeline'
import data from '../data/data'
import { Detail, MixedDetail } from '../data/data'
import { autobind } from '../../utils/decorators'
import Editor from './breakpoint-editor'
import { Type } from '../../typed/typed'

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

  @autobind
  handleListClick(item: Detail) {
    this.setState({
      detail: data.getItem(item.id)
    })
  }

  get detailType() {
    return this.state.detail.response ? Type.response : Type.request
  }

  render() {

    return (
      <div className="breakpoint">
        <div className="list">
          <Timeline data={data.breakpoints} role={TimelineRole.breakpoint} onClick={this.handleListClick}/>
        </div>
        {
          this.state.detail ? (
            <div className="break-edit">
              <Editor data={this.state.detail} type={this.detailType}/>
            </div>
          ) : null
        }

      </div>
    )
  }

}
