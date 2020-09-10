/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */

import { GET_VERSION } from '../constants';

export class VersionManager {
  constructor(version) {
    this.version = version;
    this.handleMessage = this.handleMessage.bind(this);

    self.addEventListener('message', this.handleMessage);
  }

  /*
   * Service worker sent from page messages handling
   */
  handleMessage(event) {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case GET_VERSION:
          event.ports[0].postMessage(this.version);
          break;
        default:
          break;
      }
    }
  }
}
