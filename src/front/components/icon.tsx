import * as React from 'react'
import './icon.less'

export interface IconProps {
  glyph: string
  className?: string
}

function toClass(str: any) {
  return str || ''
}

export default class Icon extends React.Component<IconProps, any> {

  get svgPath() {
    return 'icon/icon.svg'
  }

  createUseElement() {
    return `<use xlink:href="${this.svgPath}#${this.props.glyph}"></use>`
  }

  render() {
    return (
      <svg className={`icon ${toClass(this.props.className)}`} dangerouslySetInnerHTML={{__html: this.createUseElement()}}></svg>
    )
  }

}
