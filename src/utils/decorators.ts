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
