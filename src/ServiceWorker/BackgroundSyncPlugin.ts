/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0, no-restricted-syntax: 0 */
import MessageType from '../types/MessageType';
import RequestSerializer, { SerializedRequest } from '../serializers/RequestSerializer';
import ResponseSerializer, { SerializedResponse } from '../serializers/ResponseSerializer';
import ServiceWorkerMessage from '../types/ServiceWorkerMessage';
import { Queue } from 'workbox-background-sync';
import { QueueOptions } from 'workbox-background-sync/Queue';
import { WorkboxPlugin } from 'workbox-core/types';

declare const self: ServiceWorkerGlobalScope;

interface Payload {
  request: SerializedRequest;
  response: SerializedResponse;
}

export type QueuedRequestResponseMessage = ServiceWorkerMessage<Payload>;

class MouthyBackgroundSyncPlugin implements WorkboxPlugin {
  private readonly queue: Queue;

  private readonly externalOnSync?: QueueOptions['onSync'];

  private readonly requestSerializer: RequestSerializer;

  private readonly responseSerializer: ResponseSerializer;

  constructor(name: string, { onSync, ...options }: QueueOptions) {
    this.externalOnSync = onSync;
    this.queue = new Queue(name, { ...options, onSync: this.onSync });
    this.requestSerializer = new RequestSerializer();
    this.responseSerializer = new ResponseSerializer();

    self.addEventListener('message', this.handleMessage);
  }

  postResponse = async (req: Request, res: Response) => {
    const serializedRequest = await this.requestSerializer.serialize(req);
    const serializedResponse = await this.responseSerializer.serialize(res);

    const message: QueuedRequestResponseMessage = {
      type: MessageType.QUEUED_REQUEST_RESPONSE,
      payload: {
        request: serializedRequest,
        response: serializedResponse,
      },
    };

    const swClients = await self.clients.matchAll();

    swClients.forEach((client) => client.postMessage(message));
  };

  fetchDidFail = async ({ request }) => {
    await this.queue.pushRequest({ request });
  };

  onSync = () => {
    this.execQueuedRequests();
    if (this.externalOnSync) {
      this.externalOnSync({ queue: this.queue });
    }
  };

  handleMessage = (event: ExtendableMessageEvent) => {
    const message = event.data as ServiceWorkerMessage<any>;
    if (message) {
      switch (message.type) {
        case MessageType.EXEC_QUEUED_REQUESTS:
          this.execQueuedRequests();
          break;
        default:
          break;
      }
    }
  };

  execQueuedRequests = async () => {
    let entry;
    while ((entry = await this.queue.shiftRequest())) {
      try {
        const request = entry.request.clone();
        const clonedReq = entry.request.clone();
        const response = await fetch(request);
        if (process.env.DEBUG) {
          console.log(`Request for '${entry.request.url}' has been replayed in queue '${this.queue.name}'`);
        }

        this.postResponse(clonedReq, response);
      } catch (error) {
        await this.queue.unshiftRequest(entry);
        if (process.env.DEBUG) {
          console.log(
            `Request for '${entry.request.url}' failed to replay, putting it back in queue '${this.queue.name}'`,
          );
        }
        throw new Error(`Requests replay failed for Queue (${this.queue.name})`);
      }
    }
    if (process.env.DEBUG) {
      console.log(`All requests in queue '${this.queue.name}' have successfully replayed; the queue is now empty!`);
    }
  };
}
export { MouthyBackgroundSyncPlugin };
