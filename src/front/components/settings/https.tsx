'use strict'

import * as React from 'react'
import HTTPSList from './https-list'
import Checkbox from '../../base/checkbox'
import { autobind } from '../../../utils/decorators'


export interface HttpsSettingsState {
  httpsEnabled?: boolean
}

export default class HttpsSettings extends React.Component<any, HttpsSettingsState> {

  constructor() {
    super()

    this.state = {
      httpsEnabled: false
    }
  }

  @autobind
  handleCheckboxChange(e) {
    this.setState({
      httpsEnabled: e.target.checked
    })
  }

  renderHttpsAdvanced() {
    if (this.state.httpsEnabled) {
      return (
        <HTTPSList/>
      )
    }
    return null
  }

  render() {
    return (
      <fieldset className="options-form">
        <div className="item">
          <label>开启 HTTPS</label>
          <div className="content">
            <Checkbox onChange={this.handleCheckboxChange}/>
          </div>
        </div>
        {this.renderHttpsAdvanced()}
      </fieldset>
    )
  }
}
