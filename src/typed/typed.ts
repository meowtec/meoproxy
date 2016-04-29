'use strict'

import {
  Request as CatroRequest,
  Response as CatroResponse,
  Headers,
  HttpsConnect as CatroHttpsConnect
} from 'catro'

export { Headers }

export const enum MessageType {
  request,
  response
}

export const enum ipcDataState {
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

export interface Request extends CatroRequest {
  storageId: string
}

export interface Response extends CatroResponse {
  storageId: string
}

export interface IpcHTTPData {
  id: string
  state: ipcDataState
  protocol?: string
  breakpoint?: MessageType
  request?: Request
  response?: Response
}

export interface HttpsConnect extends CatroHttpsConnect {
  id: string
}

/** IPC from main to renderer */
export type IpcChannelMain = 'http-data' | 'https-connect'

/** IPC from renderer to main */
export type IpcChannelRenderer = ''
