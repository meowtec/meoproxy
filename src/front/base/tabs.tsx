'use strict'

import * as React from 'react'
import { pureRender } from '../../utils/decorators'

import './tabs.less'

export interface TabItemProps extends React.Props<any> {
  selected?: boolean
  value: string | number
}

export interface TabProps extends React.Props<any> {
  onChange: (value: string | number) => void
  value: any
  className?: string
}

export class TabItem extends React.Component<TabItemProps, any> {}

class TabContent extends React.Component<any, any> {
  render() {
    return <a href="#" className={this.props.selected ? 'selected' : ''} {...this.props}>{this.props.children}</a>
  }
}

@pureRender
export class Tab extends React.Component<TabProps, any> {

  render() {
    const props = this.props

    return (
      <div className={props.className ? props.className : 'tab-set'}>
        {
          React.Children.toArray(this.props.children).map((item: React.ReactElement<any>) => {
            let value = item.props.value
            return <a href="#" onClick={this.bindClick(value)} className={this.props.value === value ? 'selected' : ''} key={value}>{item.props.children}</a>
          })
        }
      </div>
    )
  }

  bindClick(value) {
    return () => {
      if (value !== this.props.value) {
        this.props.onChange(value)
      }
    }
  }

  static defaultProps = {
    onChange() {},
    className: ''
  }
}
