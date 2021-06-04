/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */
declare const self: ServiceWorkerGlobalScope;

interface ForcedInstallationOptions {
  shouldForceInstall: (activeServiceWorker: ServiceWorker) => Promise<boolean>;
}

const forcedInstallation = (options: ForcedInstallationOptions) => {
  async function tryToReloadClients() {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      if (client.url && 'navigate' in client) {
        try {
          // @ts-ignore
          client.navigate(client.url);
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }
    });
  }

  async function onForcedActivation() {
    self.clients.claim();
    await tryToReloadClients();
  }

  async function handleInstall() {
    const activeWorker = self.registration.active;
    if (activeWorker && (await options.shouldForceInstall(activeWorker))) {
      self.addEventListener('activate', onForcedActivation);
      await self.skipWaiting();
    }
  }

  self.addEventListener('install', handleInstall);
};

export default forcedInstallation;
