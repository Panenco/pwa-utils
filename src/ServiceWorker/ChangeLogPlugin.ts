/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */

import MessageType from '../types/MessageType';
import ServiceWorkerMessage from '../types/ServiceWorkerMessage';
import ChangelogEntry from '../types/ChangelogEntry';
import ServiceWorkerPlugin from '../types/ServiceWorkerPlugin';

declare const self: ServiceWorkerGlobalScope;

export default class ChangeLogPlugin implements ServiceWorkerPlugin {
  private readonly releases: ChangelogEntry[];

  /*
   * @param - [{ description: string, version: string, date: Date }]
   */
  constructor(releases: ChangelogEntry[]) {
    this.releases = releases;
  }

  getChangelogHistory() {
    return this.releases;
  }

  /*
   * Service worker sent from page messages handling
   */
  handleMessage = async (message: ServiceWorkerMessage<any>) => {
    const { getChangelogHistory } = this;

    switch (message.type) {
      case MessageType.GET_CHANGELOG:
        return getChangelogHistory();
      default:
        return;
    }
  };
}
