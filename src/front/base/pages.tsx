'use strict'

import * as React from 'react'
import { toString, addClass } from '../../utils/utils'
import { pureRender } from '../../utils/decorators'

export interface PageItemProps extends React.Props<any> {
  className?: string
  value: any
}

export interface PageProps extends React.Props<any> {
  className?: string
  value: any
}

export class PageItem extends React.Component<PageItemProps, any> {}

@pureRender
export class Page extends React.Component<PageProps, any> {
  render() {
    return (
      <div className={this.props.className}>
        {
          React.Children.toArray(this.props.children).map((item: React.ReactElement<any>) => {
            let value = item.props.value
            return <section key={value} className={`${toString(item.props.className)} ${addClass('hide', this.props.value !== value )}`}>{item.props.children}</section>
          })
        }
      </div>
    )
  }
}
