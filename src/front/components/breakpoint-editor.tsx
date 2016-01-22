'use strict'

import * as React from 'react'
import EditorCore from './editor-core'
import * as data from '../data/data'
import { MixedDetail } from '../data/data'
import { Type } from '../../typed/typed'
import { autobind } from '../../utils/decorators'

export interface EditorProps {
  data: MixedDetail,
  type: Type
}

export default class Editor extends React.Component<EditorProps, any> {

  @autobind
  handleSubmitClick() {

  }

  renderRequestEditor() {
    return (
      <div>
        <div className="head-line">
          <select ref="method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="DELETE">DELETE</option>
            <option value="PUT">PUT</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
          <textarea/>
        </div>
        <div className="headers">
          <textarea ref="headers"/>
        </div>
        <div className="body">
          <EditorCore mode="html" ref="body"/>
        </div>
      </div>
    )
  }

  renderResponseEditor() {
    return (
      <div>
        <div className="head-line">
          <input value="200" ref="status"/>
        </div>
        <div className="headers">
          <textarea ref="headers"/>
        </div>
        <div className="body">
          <EditorCore mode="text" ref="body"/>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.props.type === Type.request ? this.renderRequestEditor() : this.renderResponseEditor()}
        <div className="form-footer">
          <button onClick={this.handleSubmitClick}>Submit</button>
        </div>
      </div>
    )
  }
}
