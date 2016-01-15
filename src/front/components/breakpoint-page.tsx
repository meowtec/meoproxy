'use strict'

import * as React from 'react'
import Timeline from './timeline'
import { TimelineRole } from './timeline'

export default class BreakPoint extends React.Component<any, any> {
  render() {
    return (
      <div className="breakpoint">
        <div className="list">
          <Timeline data={[]} role={TimelineRole.breakpoint}/>
        </div>
      </div>
    )
  }
}