import * as React from 'react'
import './icon.less'

/* tslint:disable:no-require-imports */
const iconPrefix = require('../res/icon.svg')

export interface IconProps {
  glyph: string
  className?: string
}

function toClass(str: any) {
  return str || ''
}

export default class Icon extends React.Component<IconProps, any> {

  get svgPath() {
    return ''
  }

  createUseElement() {
    return `<use xlink:href="${this.svgPath}#${iconPrefix}${this.props.glyph}"></use>`
  }

  render() {
    return (
      <svg className={`icon ${toClass(this.props.className)}`} dangerouslySetInnerHTML={{__html: this.createUseElement()}}></svg>
    )
  }

}
