import { Headers } from '../typed/typed'

export function stringify(headers: Headers) {
  return Object.keys(headers).map((key) => {
    return key + ': ' + headers[key]
  }).join('\n')
}

export function parse(string: string): Headers {
  const obj: Headers = {}
  string.split('\n').forEach((line) => {
    const [ key, value ] = line.split(':')
    obj[key.trim()] = value.trim()
  })
  return obj
}