'use strict'

import * as React from 'react'
import { pureRender } from '../../utils/decorators'
import { toString } from '../../utils/utils'

import './icon.less'

/* tslint:disable:no-require-imports */
const iconPrefix = require('../res/icon.svg')

export interface IconProps {
  glyph: string
  className?: string
}

@pureRender
export default class Icon extends React.Component<IconProps, any> {

  render() {
    return (
      <svg className={`icon ${toString(this.props.className)}`}>
        <use xlinkHref={`#${iconPrefix}${this.props.glyph}`}></use>
      </svg>
    )
  }

}
