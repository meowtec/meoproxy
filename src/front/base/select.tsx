'use strict'

import * as React from 'react'
import Icon from './icon'
import { autobind, pureRender } from '../../utils/decorators'

import './select.less'

export interface SelectProps extends React.Props<any> {
  value?: string
  defaultValue?: string
  onChange?(e: React.FormEvent)
  theme?: string
}

@pureRender
export default class Select extends React.Component<SelectProps, any> {

  optionText: string

  refs: {
    [key: string]: any
    select: HTMLSelectElement
    optionText: HTMLElement
  }

  componentDidMount() {
    this.syncOptionText()
  }

  componentDidUpdate() {
    this.syncOptionText()
  }

  syncOptionText() {
    let optionText = this.refs.select.selectedOptions[0].textContent

    if (optionText !== this.optionText) {
      this.optionText = this.refs.optionText.textContent = optionText
    }
  }

  @autobind
  handleChange(e) {
    this.syncOptionText()
    this.props.onChange(e)
  }

  render() {
    return (
      <div className={`select ${this.props.theme}`}>
        <span className="select-content" ref="optionText"></span>
        <select ref="select"
          {...this.props}
          onChange={this.handleChange}
          >
          {this.props.children}
        </select>
       <Icon glyph="select"/>
      </div>
    )
  }

  get value() {
    return this.refs.select.value
  }

  set value(value) {
    this.refs.select.value = value
    this.syncOptionText()
  }

  static defaultProps = {
    onChange() {},
    theme: ''
  }

}
