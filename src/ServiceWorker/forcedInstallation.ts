/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

interface ForcedInstallationOptions {
  shouldForceInstall: (activeServiceWorker: ServiceWorker) => boolean;
}

const forcedInstallation = (options: ForcedInstallationOptions) => {
  async function onForcedActivation() {
    clientsClaim();
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      if (client.url && 'navigate' in client) {
        // @ts-ignore
        client.navigate(client.url);
      }
    });
  }

  function handleInstall(event: ExtendableEvent) {
    event.waitUntil(
      (async () => {
        const activeWorker = self.registration.active;
        if (activeWorker && options.shouldForceInstall(activeWorker)) {
          self.addEventListener('activate', onForcedActivation);
          await self.skipWaiting();
        }
      })(),
    );
  }

  self.addEventListener('install', handleInstall);
};

export default forcedInstallation;
