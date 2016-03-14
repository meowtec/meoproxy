'use strict'

/*!
 * 可折叠的 panel
 **/

import * as React from 'react'
import Icon from './icon'
import { addClass } from '../../utils/utils'
import { autobind } from '../../utils/decorators'

export interface PanelProps extends React.Props<any> {
  name: string
  defaultOpen?: boolean
}

export interface PanelState {
  open: boolean
}

export default class Panel extends React.Component<PanelProps, PanelState> {

  constructor(props) {
    super()

    this.state = {
      open: props.defaultOpen
    }
  }

  render() {
    return (
      <section className={`panel ${addClass('closed', !this.state.open)}`}>
        <h3 onClick={this.handleToggleClick}>
          {this.props.name}
          <Icon glyph="right"/>
        </h3>
        <dl>
          {this.props.children}
        </dl>
      </section>
    )
  }

  @autobind
  handleToggleClick() {
    this.setState({
      open: !this.state.open
    })
  }

  static defaultProps: PanelProps = {
    name: null,
    defaultOpen: true
  }

}
