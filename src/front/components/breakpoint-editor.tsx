'use strict'

import * as React from 'react'
import * as url from 'url'
import EditorCore from './editor-core'
import { DetailWithBody } from '../data/data'
import { Type } from '../../typed/typed'
import { autobind } from '../../utils/decorators'
import Select from './select'
import {
  Request as CatroRequest,
  Response as CatroResponse
} from 'catro'
import * as headersUtil from '../../utils/headers'

interface Request {
  url: string // hostname:port/path
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
  data: DetailWithBody
  onSubmit(result: CatroRequest | CatroResponse)
}


/** TODO: refactor */
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

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.data !== this.props.data) {
      this.updateDomFromProps(this.props)
    }
  }

  updateDomFromProps(props: EditorProps) {
    if (this.getType(props) === Type.request) {
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

  private getType(props?: EditorProps) {
    props = props || this.props
    return props.data && props.data.breakpoint
  }

  private beforehandRequest(data: DetailWithBody): Request {
    return {
      url: data.request.hostname + ':' + data.request.port + data.request.path,
      method: data.request.method,
      headers: headersUtil.stringify(data.request.headers),
      body: data.requestBody
    }
  }

  private beforehandResponse(data: DetailWithBody): Response {
    return {
      status: String(data.response.status),
      headers: headersUtil.stringify(data.response.headers),
      body: data.responseBody
    }
  }

  private afterhandleRequest(request: Request): CatroRequest {
    let fixedUrl = request.url
    if (!/^https?:\/\//.test(fixedUrl)) {
      /** Add protocol just for using url.parse... */
      fixedUrl = 'http://' + fixedUrl
    }

    const { hostname, port, path } = url.parse(fixedUrl)

    return {
      method: request.method,
      hostname,
      port,
      path,
      headers: headersUtil.parse(request.headers),
      body: request.body
    }
  }

  private afterhandleResponse(response: Response): CatroResponse {
    return {
      status: Number(response.status),
      headers: headersUtil.parse(response.headers),
      body: response.body
    }
  }

  @autobind
  handleSubmitClick() {
    let data
    if (this.getType() === Type.request) {
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
        <div className="form-section head-line">
          <Select ref="method" defaultValue={data.request.method}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="DELETE">DELETE</option>
            <option value="PUT">PUT</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </Select>
          <textarea rows={3} ref="url" style={{maxHeight: '90px'}}
            defaultValue={data.request.hostname + data.request.port + data.request.path}/>
        </div>
        <div className="form-section headers">
          <label className="section-title">HEADERS</label>
          <textarea rows={4} ref="headers" style={{maxHeight: '120px'}}/>
        </div>
        <div className="form-section body">
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
        <div className="form-section head-line">
          <input ref="status"/>
        </div>
        <div className="form-section headers">
          <label className="section-title">HEADERS</label>
          <textarea rows={4} ref="headers"/>
        </div>
        <div className="form-section body">
          <label className="section-title">BODY</label>
          <div className="editor-wrap">
            <EditorCore mode="text" ref="body"/>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="break-edit">
        {this.getType() === Type.request ? this.renderRequestEditor() : this.renderResponseEditor()}
        <div className="form-footer">
          <button onClick={this.handleSubmitClick}>Submit</button>
        </div>
      </div>
    )
  }
}
