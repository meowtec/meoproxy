'use strict'

let React = require('react')

require('./tabs.less')

class Empty extends React.Component {}

class TabItem extends React.Component {

  render() {
    return <a href="#" className={this.props.selected ? 'selected' : ''} {...this.props}>{this.props.children}</a>
  }

}

TabItem.defaultProps = {
  selected: false,
  onClick() {}
}


class Tab extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue
    }
  }

  render() {
    return (
      <div className="tab-set">
        {
          this.props.children.map(item => {
            let value = item.props.value
            return <TabItem onClick={this.handleClick.bind(this, value)} key={value} selected={this.state.value === value}>{item.props.children}</TabItem>
          })
        }
      </div>
    )
  }

  handleClick(value) {
    if (value !== this.state.value) {
      this.setState({
        value: value
      })
      this.props.onChange(value, this)
    }
  }
}

Tab.defaultProps = {
  defaultValue: null,
  onChange() {}
}

Tab.Item = Empty
module.exports = Tab
