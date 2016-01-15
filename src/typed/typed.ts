'use strict'

import { Request, Headers, Response } from 'catro'

export { Headers }

export enum Type {
  request, response
}

export enum ipcDataState {
  /** 代理收到下游请求 */
  open,

  /** 代理往上游服务器发送请求完毕 */
  requestFinish,

  /** 上游开始返回响应 */
  response,

  /** 上游返回响应完成 */
  responseFinish,

  /** 返回给下游结束 */
  finish
}

export interface Request extends Request {
  storageId: string
}

export interface Response extends Response {
  storageId: string
}

export interface IpcData {
  id: string
  state: ipcDataState
  request?: Request
  response?: Response
}
