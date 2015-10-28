'use strict'

/*!
 * 可折叠的 panel
 **/

let React = require('react')

let addClass = (className, condition) => {
  return condition ? className : ''
}

require('./panel.less')

class Panel extends React.Component {

  constructor(props) {
    super()

    this.state = {
      open: props.defaultOpen
    }
  }

  render() {
    return (
      <section className={`panel ${addClass('closed', !this.state.open)}`}>
        <h3 onClick={this.handleToggleClick.bind(this)}>{this.props.name}</h3>
        <dl>
          {this.props.children}
        </dl>
      </section>
    )
  }

  handleToggleClick() {
    this.setState({
      open: !this.state.open
    })
  }

}

Panel.defaultProps = {
  defaultOpen: true
}

module.exports = Panel

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
