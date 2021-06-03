/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */

import MessageType from '../types/MessageType';
import ServiceWorkerMessage from '../types/ServiceWorkerMessage';
import ServiceWorkerPlugin from '../types/ServiceWorkerPlugin';

declare const self: ServiceWorkerGlobalScope;

export default class VersionPlugin implements ServiceWorkerPlugin {
  version: string;

  constructor(version) {
    this.version = version;
  }

  /*
   * Service worker sent from page messages handling
   */
  handleMessage = async (message: ServiceWorkerMessage<any>) => {
    switch (message.type) {
      case MessageType.GET_VERSION:
        return this.version;
      default:
        return;
    }
  };
}
