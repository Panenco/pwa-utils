/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */
import MessageType from '../types/MessageType';
import ServiceWorkerMessage from '../types/ServiceWorkerMessage';
import ServiceWorkerPlugin from '../types/ServiceWorkerPlugin';

declare const self: ServiceWorkerGlobalScope;

export default class UpdatePlugin implements ServiceWorkerPlugin {
  /*
   * Service worker sent from page messages handling
   */
  async handleMessage(message: ServiceWorkerMessage<any>) {
    switch (message.type) {
      case MessageType.SKIP_WAITING:
        return self.skipWaiting();
      case MessageType.CLIENTS_CLAIM:
        return self.clients.claim();
      default:
        return;
    }
  }
}
