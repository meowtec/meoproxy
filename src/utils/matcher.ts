'use strict'

// '.*^' -> /[\.\*\^]/
const charsToReg = (chars: string) =>
  new RegExp('[' + chars.split('').map(char => '\\' + char).join('') + ']', 'g')

let str2reg
{
  const defaultChars = '/\\^$-{}[]()*.?|'
  const defaultReg = charsToReg(defaultChars)

  str2reg = (str: string, escape = '') => {
    let chars = defaultChars
    let reg = defaultReg
    if (escape) {
      chars = chars.replace(charsToReg(escape), '')
      reg = charsToReg(chars)
    }
    return '^' + str.replace(reg, '\\$&') + '$'
  }
}

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
