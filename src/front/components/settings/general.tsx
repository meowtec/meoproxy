import * as React from 'react'


export default class General extends React.Component<any, any> {

  render() {
    return (
      <fieldset className="options-form">
        <div>
          <label className="label">端口</label>
          <div className="content"><input placeholder="1080"/></div>
        </div>
        <div>
          <label className="label">端口</label>
          <div className="content"><input placeholder="1080"/></div>
        </div>
      </fieldset>
    )
  }
}
