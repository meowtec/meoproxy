'use strict'

import * as React from 'react'
import { Tab, TabItem } from '../base/tabs'
import { Page, PageItem } from '../base/pages'
import { DetailWithBody } from '../data/data'
import Panel from '../base/panel'
import * as _ from '../../utils/utils'
import { cacheBundle } from '../../utils/storage'
import { autobind } from '../../utils/decorators'

import './http-detail.less'

export const enum TabSymbol {
  headers, request, response
}

export interface HttpDetailProps extends React.Props<any> {
  data: DetailWithBody
}

export interface HttpDetailState {
  selectedId: TabSymbol
}

export default class HttpDetail extends React.Component<HttpDetailProps, any> {

  constructor(props: HttpDetailProps) {
    super(props)

    this.state = {
      selectedId: TabSymbol.headers
    }
  }

  renderResponsePreview() {
    const data = this.props.data
    const response = data.response

    if (!data.response || !data.response.storageId) {
      return null
    }

    if (/image/.test(response.headers['content-type'])) {
      return <img src={'file://' + cacheBundle.path(response.storageId)}/>
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
      let response = data.response
      let requestHeaders = data.request.headers

      let responseHeaders = {}, status
      if (response) {
        ({ status } = response)
        responseHeaders = response.headers
      }

      return (
        <div className="detail-container">
          <Tab value={this.state.selectedId} onChange={this.handleTabChange}>
            <TabItem value={TabSymbol.headers}>Headers</TabItem>
            <TabItem value={TabSymbol.request}>Request</TabItem>
            <TabItem value={TabSymbol.response}>Response</TabItem>
          </Tab>

          <Page className="detail-content" value={this.state.selectedId}>

            <PageItem value={TabSymbol.headers}>
              <div className="headers">
                <Panel name="General">
                  <dt>Method</dt>
                  <dd>{data.request.method}</dd>
                  <dt>URL</dt>
                  <dd>{_.genUrl(data.protocol, data.request.hostname, data.request.port, data.request.path)}</dd>
                  <dt>Status</dt>
                  <dd>{status}</dd>
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
              </div>
            </PageItem>

            <PageItem value={TabSymbol.request}>
              <code className="code-view">
                <pre>
                  {data.requestBody}
                </pre>
              </code>
            </PageItem>

            <PageItem value={TabSymbol.response}>
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

  @autobind
  handleTabChange(tabValue) {
    this.setState({
      selectedId: tabValue
    })
  }

}
