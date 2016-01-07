'use strict'

import * as React from 'react'
import { Empty } from './empty'

export interface PageItemProps extends React.Props<any> {
  value: any
}

export interface PageProps extends React.Props<any> {
  children?: PageItem[]
  value: any
}


export class PageItem extends React.Component<PageItemProps, any> {}

export class Page extends React.Component<PageProps, any> {
  render() {
    return (
      <div>
        {
          this.props.children.map(item => {
            let value = item.props.value
            return <section key={value} className={this.props.value === value ? '' : 'hide'}>{item.props.children}</section>
          })
        }
      </div>
    )
  }
}
