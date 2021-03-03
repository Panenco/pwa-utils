import HeadersSerializer, { SerializedHeaders } from './HeadersSerializer';

export interface SerializedRequest {
  headers: SerializedHeaders;
  method: string;
  mode: RequestMode;
  referrer: string;
  url: string;
  body: string;
}

export default class RequestSerializer {
  headersSerializer: HeadersSerializer;

  constructor() {
    this.headersSerializer = new HeadersSerializer();
  }

  async serialize(req: Request): Promise<SerializedRequest> {
    const serialized: SerializedRequest = {
      url: req.url,
      headers: this.headersSerializer.serialize(req.headers),
      method: req.method,
      mode: req.mode,
      referrer: req.referrer,
      body: JSON.stringify(await req.json()),
    };

    return serialized;
  }
  deserialize(req: SerializedRequest): Request {
    return new Request(req.url, {
      headers: this.headersSerializer.deserialize(req.headers),
      method: req.method,
      mode: req.mode,
      referrer: req.referrer,
      body: req.body,
    });
  }
}
