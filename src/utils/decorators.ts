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

export function pureRender(target) {
  target.prototype.shouldComponentUpdate = shouldComponentUpdate
}
