'use strict'

// mock
export function shouldBreak(uri: string) {
  return uri.indexOf('/break') > -1
}
