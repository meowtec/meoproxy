'use strict'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Page, PageItem } from './components/pages'
import { Tab, TabItem } from './components/tabs'
import Editor from './components/editor-core'
import Network from './components/network-page'
import Breakpoint from './components/breakpoint-page'


class Main extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      navValue: 'network'
    }

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
            <i className="icon icon-network"/>
            Network
          </TabItem>
          <TabItem value="sequence">
            <i className="icon icon-flow-tree"/>
            Sequence
          </TabItem>
          <TabItem value="breakpoints">
            <i className="icon icon-target"/>
            Breakpoints
            <span className="dot">12</span>
          </TabItem>
        </Tab>
        <Page value={this.state.navValue} className="body">
          <PageItem value="network">
            <Network/>
          </PageItem>
          <PageItem value="sequence">
            <Editor mode="js" onChange={(value, code) => {console.log(value.length)}}/>
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
