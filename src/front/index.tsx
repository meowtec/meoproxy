'use strict'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Page, PageItem } from './components/pages'
import { Tab, TabItem } from './components/tabs'
import Network from './components/network-page'
import Breakpoint from './components/breakpoint-page'
import Icon from './components/icon'
import data from './data/data'
import * as _ from '../utils/utils'
import './index.less'

class Main extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      navValue: 'network',
      breakCount: 0
    }

    this.listenEvents()
  }

  listenEvents() {
    data.on('update', () => {
      if (data.breakpoints.length !== this.state.breakCount) {
        this.setState({
          breakCount: data.breakpoints.length
        })
      }
    })
  }

  handleMainNavChange(value: string) {
    this.setState({
      navValue: value
    })
  }

  render() {
    return (
      <div className="layout">
        <Tab className="nav" defaultValue={this.state.navValue} onChange={this.handleMainNavChange.bind(this)}>
          <TabItem value="network">
            <Icon glyph="network"/>
            Network
          </TabItem>
          <TabItem value="breakpoints">
            <Icon glyph="target"/>
            Breakpoints
            <span className={`dot ${_.addClass('hide', this.state.breakCount === 0)}`}>{this.state.breakCount}</span>
          </TabItem>
          <TabItem value="settings">
            <Icon glyph="settings"/>
            Sequence
          </TabItem>
        </Tab>
        <Page value={this.state.navValue} className="body">
          <PageItem value="network">
            <Network/>
          </PageItem>
          <PageItem value="breakpoints">
            <Breakpoint/>
          </PageItem>
          <PageItem value="settings">

          </PageItem>
        </Page>
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('target'))
