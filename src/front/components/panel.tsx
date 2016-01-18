'use strict'

/*!
 * 可折叠的 panel
 **/

import * as React from 'react'
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
        <h3 onClick={this.handleToggleClick}>{this.props.name}</h3>
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

// usage
/*
<Panel name="Request header">
  <dt>Cache-Control</dt>:<dd>max-age=86400</dd>
  <dt>Cache-Control</dt>:<dd>private</dd>
  <dt>Connection</dt>:<dd>Keep-Alive</dd>
  <dt>Content-Length</dt>:<dd>160</dd>
  <dt>Content-Type</dt>:<dd>text/html</dd>
  <dt>Date</dt>:<dd>Thu, 27 Aug 2015 13:03:42 GMT</dd>
  <dt>Expires</dt>:<dd>Fri, 28 Aug 2015 13:03:42 GMT</dd>
  <dt>Location</dt>:<dd>https://www.baidu.com/</dd>
  <dt>Server</dt>:<dd>bfe/1.0.8.5</dd>
</Panel>

*/
