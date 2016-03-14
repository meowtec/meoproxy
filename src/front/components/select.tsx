import * as React from 'react'
import Icon from './icon'
import { autobind } from '../../utils/decorators'

export interface SelectState {
  displayName: string
}

export interface SelectProps extends React.Props<any> {
  value?: string
  defaultValue?: string
  onChange?(e: React.FormEvent)
  theme?: string
}

export default class Select extends React.Component<SelectProps, SelectState> {

  constructor(props) {
    super(props)

    this.state = {
      displayName: null
    }
  }

  refs: {
    [key: string]: any
    select: HTMLSelectElement
  }

  componentDidMount() {
    this.resetDisplayName()
  }

  componentDidUpdate() {
    this.resetDisplayName()
  }

  resetDisplayName() {
    let select = this.refs['select'] as HTMLSelectElement
    let selectedOption = select[select.selectedIndex]
    let displayName = selectedOption.text

    if (displayName !== this.state.displayName) {
      this.setState({
        displayName: displayName
      })
    }
  }

  @autobind
  handleChange(e) {
    this.resetDisplayName()
    this.props.onChange(e)
  }

  render() {
    return (
      <div className={`select ${this.props.theme}`}>
        <span className="select-content">{this.state.displayName}</span>
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
  }

  static defaultProps = {
    onChange() {},
    theme: ''
  }

}
