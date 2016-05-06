'use strict'

import * as React from 'react'
import { connect } from 'react-redux'
import { Tab, TabItem } from '../../base/tabs'
import { Page, PageItem } from '../../base/pages'
import EditorS from './editor-s'
import { updateHttpsMode, updateHttpsBlackList, updateHttpsWhiteList } from '../../actions/options'
import { FilterMode } from '../../../typed/options'
import { autobind } from '../../../utils/decorators'


export interface HttpsListProps {
  httpsFilterMode: FilterMode
  httpsBlackList: string[]
  httpsWhiteList: string[]
  dispatch(...any)
}

class HttpsList extends React.Component<HttpsListProps, any> {

  @autobind
  handleTabChange(value) {
    this.props.dispatch(updateHttpsMode(value))
  }

  editorUpdate(value: string, mode: FilterMode) {
    const creater = mode === FilterMode.black ? updateHttpsBlackList : updateHttpsWhiteList
    this.props.dispatch(creater(value.split('\n')))
  }

  @autobind
  handleWhiteEditorUpdate(value: string) {
    console.log(value)
    return this.editorUpdate(value, FilterMode.white)
  }

  @autobind
  handleBlackEditorUpdate(value: string) {
    return this.editorUpdate(value, FilterMode.black)
  }

  render() {
    const props = this.props
    console.log('render https list')

    return (
      <div>
        <div className="item">
          <label>HTTPS 名单</label>
          <div className="content">
            <Tab value={props.httpsFilterMode} onChange={this.handleTabChange}>
              <TabItem value={FilterMode.white}>包含</TabItem>
              <TabItem value={FilterMode.black}>排除</TabItem>
            </Tab>
          </div>
        </div>
        <Page className="https-editors" value={props.httpsFilterMode} cache={false}>
          <PageItem value={FilterMode.white}>
            <EditorS onChange={this.handleWhiteEditorUpdate} defaultValue={props.httpsWhiteList.join('\n')}/>
          </PageItem>
          <PageItem value={FilterMode.black}>
            <EditorS onChange={this.handleBlackEditorUpdate} defaultValue={props.httpsBlackList.join('\n')}/>
          </PageItem>
        </Page>
      </div>
    )
  }
}

export default connect(state => ({
  httpsFilterMode: state.httpsFilterMode,
  httpsBlackList: state.httpsBlackList,
  httpsWhiteList: state.httpsWhiteList
}))(HttpsList)
