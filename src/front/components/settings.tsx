'use strict'

import * as React from 'react'
import { Provider } from 'react-redux'
import { Page, PageItem } from '../base/pages'
import { Tab, TabItem } from '../base/tabs'
import { autobind } from '../../utils/decorators'
import General from './settings/general'
import HTTPSSettings from './settings/https'
import store from '../data/options'

import './settings.less'

export enum SettingsId {
  general,
  breakpoint
}

export interface SettingsState {
  tabValue: SettingsId
}

export default class Settings extends React.Component<any, SettingsState> {
  constructor(props) {
    super(props)

    this.state = {
      tabValue: SettingsId.breakpoint
    }
  }

  @autobind
  handleTabChange(tabValue) {
    this.setState({
      tabValue
    })
  }

  render() {
    return (
      <Provider store={store}>
        <div className="settings">
          <Tab value={this.state.tabValue} onChange={this.handleTabChange}>
            <TabItem value={SettingsId.general}>General</TabItem>
            <TabItem value={SettingsId.breakpoint}>HTTPS</TabItem>
          </Tab>
          <Page className="settings-body" value={this.state.tabValue} cache={false}>
            <PageItem value={SettingsId.general}>
              <General/>
            </PageItem>
            <PageItem value={SettingsId.breakpoint}>
              <HTTPSSettings/>
            </PageItem>
          </Page>
        </div>
      </Provider>
    )
  }
}
