'use strict'

let React = require('react')

class Empty extends React.Component {}

class Pages extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children.map(item => {
            let value = item.props.value
            return <section key={value} className={this.props.value === value ? '' : 'hide'}>{item.props.children}</section>
          })
        }
      </div>
    )
  }
}

Pages.Item = Empty

module.exports = Pages
