'use strict'

import * as React from 'react'
import { connect } from 'react-redux'

class General extends React.Component<any, any> {

  render() {
    return (
      <fieldset className="options-form">
        <div className="item">
          <label>端口</label>
          <div className="content"><input placeholder="1080" value={this.props.port}/></div>
        </div>
        <div className="item">
          <label>端口</label>
          <div className="content"><input placeholder="1080"/></div>
        </div>
      </fieldset>
    )
  }

}

export default connect(state => ({
  port: state.port
}))(General)
