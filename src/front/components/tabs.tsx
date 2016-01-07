'use strict'

import * as React from 'react'
import { Empty } from './empty'


export interface TabItemProps extends React.Props<any> {
  selected?: boolean
  value: any
}

export interface TabProps extends React.Props<any> {
  onChange: (any)
  children?: TabItem[]
  defaultValue: any
}

export interface TabState {
  value: any
}

export class TabItem extends React.Component<TabItemProps, any> {}

class TabContent extends React.Component<any, any> {
  render() {
    return <a href="#" className={this.props.selected ? 'selected' : ''} {...this.props}>{this.props.children}</a>
  }
}

export class Tab extends React.Component<TabProps, TabState> {

  constructor(props: TabProps) {
    super(props)

    this.state = {
      value: props.defaultValue
    }
  }

  render() {
    return (
      <div className="tab-set">
        {
          this.props.children.map(item => {
            let value = item.props.value
            return <TabContent onClick={this.handleClick.bind(this, value)} key={value} selected={this.state.value === value}>{item.props.children}</TabContent>
          })
        }
      </div>
    )
  }

  handleClick(value) {
    if (value !== this.state.value) {
      this.setState({
        value: value
      })
      this.props.onChange(value)
    }
  }
}
