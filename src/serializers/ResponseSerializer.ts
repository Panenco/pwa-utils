import HeadersSerializer, { SerializedHeaders } from './HeadersSerializer';

export interface SerializedResponse {
  body: string;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  headers: SerializedHeaders;
  url: string;
}

export default class ResponseSerializer {
  private readonly headersSerializer: HeadersSerializer;
  constructor() {}

  async serialize(res: Response): Promise<SerializedResponse> {
    return {
      body: JSON.stringify(await res.json()),
      ok: res.ok,
      redirected: res.redirected,
      status: res.status,
      statusText: res.statusText,
      type: res.type,
      headers: this.headersSerializer.serialize(res.headers),
      url: res.url,
    };
  }
  deserialize(res: SerializedResponse): Response {
    return new Response(res.body, {
      headers: this.headersSerializer.deserialize(res.headers),
      status: res.status,
      statusText: res.statusText,
    });
  }
}
