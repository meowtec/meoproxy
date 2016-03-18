'use strict'

import * as React from 'react'
import * as CodeMirror from 'codemirror'

import './editor-core.less'

const EditorMode = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/js'
}

export interface EditorProps extends React.Props<any> {
  mode: string
  onChange?(value: string, codeMirror: CodeMirror.Editor): void
  defaultValue?: string
  value?: string
}

export default class Editor extends React.Component<EditorProps, any> {
  cmConfig: CodeMirror.EditorConfiguration
  codeMirror: CodeMirror.Editor

  constructor(props) {
    super(props)

    this.cmConfig = {
      value: props.value || props.defaultValue,
      mode: EditorMode[props.mode],
      indentUnit: 2,
      indentWithTabs: true,
      lineNumbers: true,
      extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList'
      },
      theme: 'neo'
    }
  }

  componentDidMount() {
    const element: any = this.refs['target']

    this.codeMirror = CodeMirror(element, this.cmConfig)
    this.bindEvent()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != null && nextProps.value !== this.value) {
      this.updateEditorValue(nextProps.value)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  bindEvent() {
    const codeMirror = this.codeMirror

    codeMirror.on('change', () => {
      this.props.onChange && this.props.onChange(this.value, codeMirror)
    })
  }

  render() {
    return (
      <label className="text-editor" ref="target"></label>
    )
  }

  updateEditorValue(value) {
    this.codeMirror.getDoc().setValue(value)
  }

  get value() {
    return this.codeMirror.getDoc().getValue()
  }

  set value(value) {
    this.updateEditorValue(value)
  }

  static defaultProps = {
    defaultValue: ''
  }
}
