'use strict'

import * as React from 'react'
import EditorCore from '../../base/editor-core'
import { autobind } from '../../../utils/decorators'
import './editor-s.less'


export interface EditorProps {
  button?: string
  defaultValue?: string
  onChange(value: string)
}

export interface EditorState {
  unsave: boolean
}

export default class Editor extends React.Component<EditorProps, EditorState> {

  refs: {
    [key: string]: any
    editor: EditorCore
  }

  constructor(props) {
    super(props)

    this.state = {
      unsave: false
    }
  }

  @autobind
  handleEditorCoreChange() {
    this.setState({
      unsave: true
    })
  }

  @autobind
  handleSaveClick() {
    this.setState({
      unsave: false
    })
    this.props.onChange(this.refs.editor.value)
  }

  public get value() {
    return this.refs.editor.value
  }

  public set value(value) {
    this.refs.editor.value = value
  }

  render() {
    return (
      <div className="editor-s">
        {
          this.state.unsave ? (
            <div className="button-container">
              <button onClick={this.handleSaveClick}>{this.props.button}</button>
            </div>
          ) : null
        }
        <EditorCore mode="text" ref="editor" onChange={this.handleEditorCoreChange} defaultValue={this.props.defaultValue}/>
      </div>
    )
  }

  static defaultProps = {
    button: 'SAVE',
    onChange() {}
  }

}
