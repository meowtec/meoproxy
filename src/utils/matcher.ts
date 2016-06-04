'use strict'

// '.*^' -> /[\.\*\^]/
function _chars2reg(chars: string) {
  return new RegExp('[' + chars.split('').map(char => '\\' + char).join('') + ']', 'g')
}

const str2reg = (() => {
  const defaultChars = '/\\^$-{}[]()*.?|'
  const defaultReg = _chars2reg(defaultChars)

  return (str: string, escape = '') => {
    let chars = defaultChars
    let reg = defaultReg
    if (escape) {
      chars = chars.replace(_chars2reg(escape), '')
      reg = _chars2reg(chars)
    }
    return '^' + str.replace(reg, '\\$&') + '$'
  }
})()

export default class Matcher {

  private raw: string
  private regexp: RegExp

  constructor(raw: string) {
    this.raw = raw
    this.regexp = new RegExp(str2reg(raw, '*').replace(/\*/g, '.*'))
  }

  test(string: string) {
    return this.regexp.test(string)
  }

}
