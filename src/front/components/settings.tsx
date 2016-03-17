'use strict'

import * as React from 'react'
import { Page, PageItem } from '../base/pages'
import { Tab, TabItem } from '../base/tabs'
import { autobind } from '../../utils/decorators'
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
      tabValue: SettingsId.general
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
      <div className="settings">
        <Tab value={this.state.tabValue} onChange={this.handleTabChange}>
          <TabItem value={SettingsId.general}>General</TabItem>
          <TabItem value={SettingsId.breakpoint}>BreakPoint</TabItem>
        </Tab>
        <Page value={this.state.tabValue}>
          <PageItem value={SettingsId.general}>1</PageItem>
          <PageItem value={SettingsId.breakpoint}>2</PageItem>
        </Page>
      </div>
    )
  }
}
