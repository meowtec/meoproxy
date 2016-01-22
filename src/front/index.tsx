'use strict'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Page, PageItem } from './components/pages'
import { Tab, TabItem } from './components/tabs'
import Network from './components/network-page'
import Breakpoint from './components/breakpoint-page'
import data from './data/data'
import * as _ from '../utils/utils'


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
      this.setState({
        breakCount: data.breakpoints.length
      })
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
            <i className="icon" data-glyph="network"/>
            Network
          </TabItem>
          <TabItem value="sequence">
            <i className="icon" data-glyph="flow-tree"/>
            Sequence
          </TabItem>
          <TabItem value="breakpoints">
            <i className="icon" data-glyph="target"/>
            Breakpoints
            <span className={`dot ${_.addClass('hide', this.state.breakCount === 0)}`}>{this.state.breakCount}</span>
          </TabItem>
        </Tab>
        <Page value={this.state.navValue} className="body">
          <PageItem value="network">
            <Network/>
          </PageItem>
          <PageItem value="sequence">

          </PageItem>
          <PageItem value="breakpoints">
            <Breakpoint/>
          </PageItem>
        </Page>
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('target'))
