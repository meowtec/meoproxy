'use strict'

import * as React from 'react'

const EditorMode = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/js'
}

export interface EditorProps {
  mode: string
  onChange(value: string, codeMirror: CodeMirror.Editor): void
  defaultValue?: string
}

export default class Editor extends React.Component<EditorProps, any> {
  cmConfig: CodeMirror.EditorConfiguration
  codeMirror: CodeMirror.Editor

  constructor(props) {
    super(props)

    this.cmConfig = {
      value: props.defaultValue || '',
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

    setTimeout(() => {
      let codeMirror = CodeMirror(element, this.cmConfig)
      this.codeMirror = codeMirror

      this.bindEvent()
    }, 3000)
  }

  bindEvent() {
    const codeMirror = this.codeMirror

    codeMirror.on('change', (codeMirror) => {
      this.props.onChange(codeMirror.getDoc().getValue(), codeMirror)
    })
  }

  render() {
    return (
      <label className="text-editor" ref="target"></label>
    )
  }

}
