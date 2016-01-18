'use strict'

import * as React from 'react'


export interface TabItemProps extends React.Props<any> {
  selected?: boolean
  value: string | number
}

export interface TabProps extends React.Props<any> {
  onChange: (value: string | number) => void
  defaultValue: any
  className?: string
}

export interface TabState {
  value: string | number
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
    const props = this.props

    return (
      <div className={props.className ? props.className : 'tab-set'}>
        {
          React.Children.toArray(this.props.children).map((item: React.ReactElement<any>) => {
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

  static defaultProps = {
    onChange() {},
    className: ''
  }
}
