'use strict'

import * as React from 'react'
import Icon from './icon'
import { pureRender, autobind } from '../../utils/decorators'

import './file.less'

export interface FileProps {
  onChange?(file: File)
}

@pureRender
export default class FileOpener extends React.Component<FileProps, any> {

  @autobind
  handleFileChange(e) {
    this.props.onChange(e.target.files[0])
    e.target.value = null
  }

  render() {
    return (
      <label className="file-opener">
        <input type="file" onChange={this.handleFileChange}/>
        <Icon glyph="folder-open"/>
      </label>
    )
  }

  static defaultProps = {
    onChange() {}
  }
}
