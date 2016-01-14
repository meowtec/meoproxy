'use strict'

import * as React from 'react'

export interface PageItemProps extends React.Props<any> {
  value: any
}

export interface PageProps extends React.Props<any> {
  className?: string
  value: any
}


export class PageItem extends React.Component<PageItemProps, any> {}

export class Page extends React.Component<PageProps, any> {
  render() {
    return (
      <div className={this.props.className}>
        {
          React.Children.toArray(this.props.children).map((item: React.ReactElement<any>) => {
            let value = item.props.value
            return <section key={value} className={this.props.value === value ? '' : 'hide'}>{item.props.children}</section>
          })
        }
      </div>
    )
  }
}
