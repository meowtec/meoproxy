import { shouldComponentUpdate } from 'react-addons-pure-render-mixin'

export function autobind(target, key, descriptor) {
  return {
    get() {
      const fun = descriptor.value.bind(this)
      Object.defineProperty(this, key, {
        value: fun
      })
      return fun
    }
  }
}

export function pureRender(component) {
  component.prototype.shouldComponentUpdate = shouldComponentUpdate
}

export function independent(component) {
  component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    return this.state !== nextState
  }
}
