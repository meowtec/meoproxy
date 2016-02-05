'use strict'

import * as React from 'react'
import * as url from 'url'
import EditorCore from './editor-core'
import { MixedDetail } from '../data/data'
import { Type, Headers } from '../../typed/typed'
import { autobind } from '../../utils/decorators'
import Select from './select'
import {
  Request as CatroRequest,
  Response as CatroResponse
} from 'catro'

function headersStringify(headers: Headers) {
  return Object.keys(headers).map((key) => {
    return key + ': ' + headers[key]
  }).join('\n')
}

function headersParse(string: string): Headers {
  const obj: Headers = {}
  string.split('\n').forEach((line) => {
    // const tuple = line
  })
  return obj
}

interface Request {
  url: string
  method: string
  headers: string
  body: string
}

interface Response {
  status: string
  headers: string
  body: string
}

export interface EditorProps {
  data: MixedDetail
  type: Type
  onSubmit(result: CatroRequest | CatroResponse)
}


export default class Editor extends React.Component<EditorProps, any> {

  refs: {
    [key: string]: any
    method: Select
    body: EditorCore
  }

  constructor(props) {

    super(props)

    this.state = {
      requestForm: {},
      responseForm: {}
    }

    // let select = this.refs.method
  }

  componentDidMount() {
    this.updateDomFromProps(this.props)
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (nextProps.data !== this.props.data) {
      this.updateDomFromProps(nextProps)
    }
  }

  updateDomFromProps(props: EditorProps) {
    if (props.type === Type.request) {
      let data = this.beforehandRequest(props.data)
      this.refs.method.value = data.method
      this.refs['url'].value = data.url
      this.refs['headers'].value = data.headers
      this.refs.body.value = data.body
    }
    else {
      let data = this.beforehandResponse(props.data)
      this.refs['status'].value = data.status
      this.refs['headers'].value = data.headers
      this.refs['body'].value = data.body
    }
  }

  private beforehandRequest(data: MixedDetail): Request {
    return {
      url: data.request.hostname + ':' + data.request.port + data.request.path,
      method: data.request.method,
      headers: headersStringify(data.request.headers),
      body: data.requestBody
    }
  }

  private beforehandResponse(data: MixedDetail): Response {
    return {
      status: String(data.response.status),
      headers: headersStringify(data.response.headers),
      body: data.responseBody
    }
  }

  private afterhandleRequest(request: Request): CatroRequest {
    const obj = url.parse(request.url)

    return {
      method: request.method,
      hostname: obj.hostname,
      port: obj.port,
      path: obj.path,
      headers: headersParse(request.headers),
      body: request.body
    }
  }

  private afterhandleResponse(response: Response): CatroResponse {
    return {
      status: Number(response.status),
      headers: headersParse(response.headers),
      body: response.body
    }
  }

  @autobind
  handleSubmitClick() {
    let data
    if (this.props.type === Type.request) {
      data = this.afterhandleRequest({
        url: this.refs['url'].value,
        method: this.refs.method.value,
        headers: this.refs['headers'].value,
        body: this.refs.body.value
      })
    }
    else {
      data = this.afterhandleResponse({
        status: this.refs['status'].value,
        headers: this.refs['headers'].value,
        body: this.refs['body'].value
      })
    }

    this.props.onSubmit(data)
  }

  renderRequestEditor() {
    const data = this.props.data

    return (
      <div className="form-list">
        <div className="head-line">
          <Select ref="method" defaultValue={data.request.method}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="DELETE">DELETE</option>
            <option value="PUT">PUT</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </Select>
          <textarea rows={3} ref="url" style={{maxHeight: '90px'}}  defaultValue={data.request.hostname + data.request.port + data.request.path}/>
        </div>
        <div className="headers">
          <label className="section-title">HEADERS</label>
          <textarea rows={4} ref="headers" style={{maxHeight: '120px'}}/>
        </div>
        <div className="body">
          <label className="section-title">PAYLOAD</label>
          <div className="editor-wrap">
            <EditorCore mode="html" ref="body"/>
          </div>
        </div>
      </div>
    )
  }

  renderResponseEditor() {
    return (
      <div className="form-list">
        <div className="head-line">
          <input value="200" ref="status"/>
        </div>
        <div className="headers">
          <textarea rows={4} ref="headers"/>
        </div>
        <div className="body">
          <EditorCore mode="text" ref="body"/>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="break-edit">
        {this.props.type === Type.request ? this.renderRequestEditor() : this.renderResponseEditor()}
        <div className="form-footer">
          <button onClick={this.handleSubmitClick}>Submit</button>
        </div>
      </div>
    )
  }
}
