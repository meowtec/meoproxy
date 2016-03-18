import * as React from 'react'
import { Tab, TabItem } from '../../base/tabs'
import { Page, PageItem } from '../../base/pages'
import Editor from '../../base/editor-core'

export default class HttpsList extends React.Component<any, any> {

  constructor() {
    super()

    this.state = {
      tabIndex: 0,
      includeValue: '',
      excludeValue: ''
    }
  }

  render() {
    console.log('render https list')
    return (
      <div>
        <div className="item">
          <label>HTTPS 名单</label>
          <div className="content">
            <Tab value={this.state.tabIndex} onChange={(tabIndex) => this.setState({tabIndex})}>
              <TabItem value={0}>包含</TabItem>
              <TabItem value={1}>排除</TabItem>
            </Tab>
          </div>
        </div>
        <Page className="https-editors" value={this.state.tabIndex} cache={false}>
          <PageItem value={0}>
            <Editor mode="text" value={this.state.includeValue} onChange={(includeValue) => this.setState({includeValue})}/>
          </PageItem>
          <PageItem value={1}>
            <Editor mode="text" value={this.state.excludeValue}/>
          </PageItem>
        </Page>
      </div>
    )
  }
}
