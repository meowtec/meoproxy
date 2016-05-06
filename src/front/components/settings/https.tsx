'use strict'

import * as React from 'react'
import { connect } from 'react-redux'
import HttpsList from './https-list'
import Checkbox from '../../base/checkbox'
import { autobind } from '../../../utils/decorators'
import { switchHttps } from '../../actions/options'

class HttpsSettings extends React.Component<any, any> {

  constructor() {
    super()
  }

  @autobind
  handleCheckboxChange(e) {
    this.props.dispatch(switchHttps())
  }

  render() {
    let httpsEnabled = this.props.httpsEnabled
    return (
      <fieldset className="options-form">
        <div className="item">
          <label>开启 HTTPS</label>
          <div className="content">
            <Checkbox onChange={this.handleCheckboxChange} checked={httpsEnabled}/>
          </div>
        </div>
        {httpsEnabled ? <HttpsList/> : null}
      </fieldset>
    )
  }
}

export default connect(state => ({
  httpsEnabled: state.httpsEnabled
}), dispatch => ({ dispatch }))(HttpsSettings)
