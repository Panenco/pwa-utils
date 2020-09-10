/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0, no-restricted-syntax: 0 */
import { Queue } from 'workbox-background-sync';
import { EXEC_QUEUED_REQUESTS, QUEUED_REQUEST_RESPONSE } from './constants';

Headers.prototype.toString = function toString() {
  const result = {};
  for (const [header, value] of this.entries()) {
    result[header] = value;
  }
  return result;
};

class MouthyBackgroundSyncPlugin {
  constructor(name, options) {
    if (options.onSync) {
      this.externalOnSync = options.onSync;
    }

    this.fetchDidFail = this.fetchDidFail.bind(this);
    this.onSync = this.onSync.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.execQueuedRequests = this.execQueuedRequests.bind(this);

    this.queue = new Queue(name, { ...options, onSync: this.onSync });

    // Init of message handler
    self.addEventListener('message', this.handleMessage);
  }

  static async postResponse(req, res) {
    const serializedRequest = {
      headers: req.headers.toString(),
      method: req.method,
      mode: req.mode,
      refferer: req.refferer,
      url: req.url,
      body: await req.json(),
    };

    const serializedResponse = {
      // `data` is the response that was provided by the server
      data: await res.json(),

      // `status` is the HTTP status code from the server response
      status: res.status,

      // `statusText` is the HTTP status message from the server response
      statusText: res.statusText,

      // `headers` the HTTP headers that the server responded with
      // All header names are lower cased and can be accessed using the bracket notation.
      // Example: `response.headers['content-type']`
      headers: res.headers.toString(),

      // `request` is the request that generated this response
      // and an XMLHttpRequest instance in the browser
      request: serializedRequest,
    };

    const message = {
      type: QUEUED_REQUEST_RESPONSE,
      payload: serializedResponse,
    };

    const swClients = await self.clients.matchAll();

    swClients.forEach((client) => client.postMessage(message));
  }

  async fetchDidFail({ request }) {
    await this.queue.pushRequest({ request });
  }

  onSync() {
    this.execQueuedRequests();
    if (typeof this.externalOnSync === 'function') {
      this.externalOnSync({ queue: this });
    }
  }

  handleMessage(event) {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case EXEC_QUEUED_REQUESTS:
          this.execQueuedRequests();
          break;
        default:
          break;
      }
    }
  }

  /* eslint no-await-in-loop: 0, no-cond-assign: 0 */
  async execQueuedRequests() {
    let entry;
    while ((entry = await this.queue.shiftRequest())) {
      try {
        const request = entry.request.clone();
        const clonedReq = entry.request.clone();
        const response = await fetch(request);
        if (process.env.DEBUG) {
          console.log(`Request for '${entry.request.url}' has been replayed in queue '${this.queue._name}'`);
        }

        MouthyBackgroundSyncPlugin.postResponse(clonedReq, response);
      } catch (error) {
        await this.queue.unshiftRequest(entry);
        if (process.env.DEBUG) {
          console.log(
            `Request for '${entry.request.url}' failed to replay, putting it back in queue '${this.queue._name}'`,
          );
        }
        throw new Error(`Requests replay failed for Queue (${this.queue._name})`);
      }
    }
    if (process.env.DEBUG) {
      console.log(`All requests in queue '${this.queue.name}' have successfully replayed; the queue is now empty!`);
    }
  }
}
export { MouthyBackgroundSyncPlugin };
