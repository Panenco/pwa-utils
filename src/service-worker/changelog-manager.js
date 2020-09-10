/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */

import { GET_CHANGELOG } from './constants';

export class ChangeLogManager {
  /*
   * @param - [{ description: string, version: string, date: Date }]
   */
  constructor(releases) {
    this.releases = releases;

    this.handleMessage = this.handleMessage.bind(this);

    self.addEventListener('message', this.handleMessage);
  }

  getChangelogHistory() {
    return this.releases;
  }

  /*
   * Service worker sent from page messages handling
   */
  handleMessage(event) {
    const { getChangelogHistory } = this;

    if (event.data && event.data.type) {
      switch (event.data.type) {
        case GET_CHANGELOG:
          event.ports[0].postMessage(getChangelogHistory());
          break;
        default:
          break;
      }
    }
  }
}
