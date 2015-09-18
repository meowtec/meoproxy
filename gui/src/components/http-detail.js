'use strict'

let React = require('react')
let Tabs = require('./tabs')
let Tab = Tabs.Item
let Pages = require('./Pages')
let Page = Pages.Item
let Panel = require('./panel')
// let event = require('../utils/event')
let ipc = require('ipc')

class HttpDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedId: 'headers'
    }

    ipc.on('response-body-data', this.setState.bind(this))

    ipc.on('test-emit', function(date) {
      // console.log(date)
    })
  }

  // 获取 HTTP body 的数据
  updateBodyData() {
    ipc.send('get-body-data', this.props.id)
  }

  render() {
    let code = `function() {\n  a()\n}`

    return (
      <div style={{marginLeft: '15px'}}>
        <Tabs defaultValue={this.state.selectedId} onChange={this.handleTabChange.bind(this)}>
          <Tab value="headers">Headers</Tab>
          <Tab value="request">Request</Tab>
          <Tab value="response">Response</Tab>
        </Tabs>

        <Pages value={this.state.selectedId}>
          <Page value="headers">
            <Panel>General</Panel>
            <Panel>Request Headers</Panel>
            <Panel>Response Headers</Panel>
          </Page>
          <Page value="request">
            <code>
              <pre>
                {'empty'}
              </pre>
            </code>
          </Page>
          <Page value="response">
            <code>
              <pre>
                {code}
              </pre>
            </code>
          </Page>
        </Pages>
      </div>
    )
  }

  handleTabChange(tabValue) {
    this.setState({
      selectedId: tabValue
    })
  }
}

module.exports = HttpDetail
