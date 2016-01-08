declare module "catro" {

  import * as http from 'http'
  import { EventEmitter } from 'events'
  import { Readable } from 'stream';

  interface Headers {
      [key: string]: string;
  }
  /**
   * Request is a superset of <http.requestOptions>
   */
  interface Request {
      method: string;
      hostname: string;
      port: number;
      path: string;
      headers: Headers;
      body: Readable | string | Buffer;
  }

  interface Response {
      status: number;
      headers: Headers;
      body: Readable | string | Buffer;
  }

  interface KeyCertPair {
      key: Buffer;
      cert: Buffer;
  }

  interface CertManager {
      readCerts(domain: string): Promise<KeyCertPair>;
      rootCAExist(): Promise<boolean>;
      getCerts(domain: string): Promise<KeyCertPair>;
  }

  interface RequestHandler extends EventEmitter {
      scheme: string;
      req: http.IncomingMessage;
      res: http.ServerResponse;
      replaceRequest: (request: Request, requestHandler?: RequestHandler) => Promise<Request> | Request;
      replaceResponse: (request: Response, requestHandler?: RequestHandler) => Promise<Response> | Response;
      request: Request;
      response: Response;
      preventRequest(): void;
  }

  interface Options {
    /** proxy port */
    port: number;
    /** path to storage certRoot */
    certRoot?: string;
    /** whether proxy ssl */
    https?: {
        (host: string): boolean;
    } | boolean;
  }

  export default class Proxy extends EventEmitter {
      constructor(options: Options, callback?: (err, proxy) => any);
      static rootCAPath: string;
      static logger: Readable;
      promise: Promise<any>;
      httpServer: http.Server;
  }
}
