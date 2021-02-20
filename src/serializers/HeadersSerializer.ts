export type SerializedHeaders = Record<string, string>;

export default class HeadersSerializer {
  serialize(headers: Headers): SerializedHeaders {
    const result = {};
    for (const [header, value] of Object.entries.apply(headers)) {
      result[header] = value;
    }
    return result;
  }

  deserialize(serialized: SerializedHeaders): Headers {
    return new Headers(serialized);
  }
}
