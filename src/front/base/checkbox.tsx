'use strict'

import * as React from 'react'
import { pureRender } from '../../utils/decorators'

import './checkbox.less'

@pureRender
export default class Icon extends React.Component<any, any> {

  render() {
    return (
      <input ref="input" className="checkbox" type="checkbox" {...this.props}/>
    )
  }

}
