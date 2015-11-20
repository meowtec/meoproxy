'use strict'
let React = require('react')
let Tabs = require('./tabs')
let Tab = Tabs.Item
let Pages = require('./Pages')
let Page = Pages.Item
let Panel = require('./panel')
let _ = require('../utils/utils')

class HttpDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedId: 'headers'
    }
  }

  render() {
    let code = `function() {\n  a()\n}`
    let data = this.props.data

    if (data) {
      let requestHeaders = data.request.headers
      let responseHeaders = data.response.headers

      return (
        <div style={{marginLeft: '15px'}}>
          <Tabs defaultValue={this.state.selectedId} onChange={this.handleTabChange.bind(this)}>
            <Tab value="headers">Headers</Tab>
            <Tab value="request">Request</Tab>
            <Tab value="response">Response</Tab>
          </Tabs>

          <Pages value={this.state.selectedId}>

            <Page value="headers">
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
            </Page>

            <Page value="request">
              <code>
                <pre>
                  {data.requestBody}
                </pre>
              </code>
            </Page>

            <Page value="response">
              <code>
                <pre>
                  {data.responseBody}
                </pre>
              </code>
            </Page>

          </Pages>
        </div>
      )
    } else {
      return null
    }
  }

  handleTabChange(tabValue) {
    this.setState({
      selectedId: tabValue
    })
  }
}

HttpDetail.defaultProps = {
  data: null
}

module.exports = HttpDetail
