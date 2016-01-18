'use strict'

import * as React from 'react'

import { Tab, TabItem } from './tabs'
import { Page, PageItem } from './pages'
import { Detail, Bodies } from '../data/data'

import Panel from './panel'
import * as _ from '../../utils/utils'
import * as storage from '../../utils/storage'

export interface HttpDetailProps extends React.Props<any> {
  data: Detail & Bodies
}

export default class HttpDetail extends React.Component<HttpDetailProps, any> {

  constructor(props: HttpDetailProps) {
    super(props)

    this.state = {
      selectedId: 'headers'
    }
  }

  renderResponsePreview() {
    const data = this.props.data
    const response = data.response

    if (!data.response || !data.response.storageId) return null

    if (/image/.test(response.headers['content-type'])) {
      return <img src={'file://' + storage.getTempDir() + '/' + response.storageId}/>
    }

    return (
      <code className="code-view">
        <pre>
          {data.responseBody}
        </pre>
      </code>
    )
  }

  render() {
    let data = this.props.data

    if (data) {
      let requestHeaders = data.request.headers
      let responseHeaders = data.response.headers

      return (
        <div className="detail-container">
          <Tab defaultValue={this.state.selectedId} onChange={this.handleTabChange.bind(this)}>
            <TabItem value="headers">Headers</TabItem>
            <TabItem value="request">Request</TabItem>
            <TabItem value="response">Response</TabItem>
          </Tab>

          <Page className="detail-content" value={this.state.selectedId}>

            <PageItem value="headers">
              <Panel name="General">
                <dt>Method</dt>
                <dd>{data.request.method}</dd>
                <dt>URL</dt>
                <dd>{_.genUrl(data.ssl, data.request.hostname, data.request.port, data.request.path)}</dd>
                <dt>Status</dt>
                <dd>{data.response.status}</dd>
              </Panel>
              <Panel name="Request Headers">
                {
                  Object.keys(requestHeaders).map(key => {
                    return (
                      [
                        <dt>{key}</dt>,
                        <dd>{requestHeaders[key]}</dd>
                      ]
                    )
                  })
                }
              </Panel>
              <Panel name="Response Headers">
                {
                  Object.keys(responseHeaders).map(key => {
                    return (
                      [
                        <dt>{key}</dt>,
                        <dd>{responseHeaders[key]}</dd>
                      ]
                    )
                  })
                }
              </Panel>
            </PageItem>

            <PageItem value="request">
              <code className="code-view">
                <pre>
                  {data.requestBody}
                </pre>
              </code>
            </PageItem>

            <PageItem value="response">
              { this.renderResponsePreview() }
            </PageItem>

          </Page>
        </div>
      )
    }
    else {
      return null
    }
  }

  handleTabChange(tabValue) {
    this.setState({
      selectedId: tabValue
    })
  }

}
