/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { googleFontsCache } from 'workbox-recipes';
import { NetworkOnly } from 'workbox-strategies';
import imagesCache from './imagesCache';
import ServiceWorkerPlugin from './ServiceWorkerPlugin';
import ServiceWorkerMessage from '../types/ServiceWorkerMessage';

declare const self: ServiceWorkerGlobalScope;

const defaults = {
  cacheName: 'cache',
  expiration: {
    images: 30 * 24 * 60 * 60, // 30 Days
    fonts: 365 * 24 * 60 * 60, // 1 Year
    api: 24 * 60 * 60, // 24 hours
  },
  entryPoint: '/index.html',
};

export interface ServiceWorkerCoreOptions {
  cacheName: string;
  expiration: {
    images?: number;
    fonts?: number;
    api?: number;
  };
  entryPoint?: string;
  plugins?: ServiceWorkerPlugin[];
}

export function serviceWorkerCore(options: ServiceWorkerCoreOptions = defaults) {
  /*
   * Service worker sent from page messages handling
   */

  const handleMessage = async (event: ExtendableMessageEvent) => {
    if (process.env.DEBUG) {
      console.groupCollapsed('Service worker reveived an event message:');
      console.dir(event);
      console.groupEnd();
    }
    const message = event.data as ServiceWorkerMessage<any>;

    if (Array.isArray(options.plugins)) {
      for (const plugin of options.plugins) {
        const response = await plugin.handleMessage(message);
        if (response) {
          event.ports[0].postMessage(response);
          break;
        }
      }
    }
  };

  self.addEventListener('message', handleMessage);

  setCatchHandler(new NetworkOnly());

  /*
   * Static assets cache rules
   */

  precacheAndRoute(self.__WB_MANIFEST);

  googleFontsCache({
    cachePrefix: `${options.cacheName}_`,
    maxAgeSeconds: options.expiration.fonts,
  });

  imagesCache({
    cachePrefix: `${options.cacheName}_`,
    maxAgeSeconds: options.expiration.images,
  });

  /*
   * Serving of main entry point "/index.html" file for all requests.
   * This is made to be able to handle routing via js router and to be able opening app from any "route point".
   */

  const handler = createHandlerBoundToURL(options.entryPoint ?? defaults.entryPoint);
  const navigationRoute = new NavigationRoute(handler);
  registerRoute(navigationRoute);

  /*
   * Handling errors of service worker environment
   */

  self.addEventListener('error', (e) => {
    if (process.env.DEBUG) {
      console.log(e.filename, e.lineno, e.colno, e.message);
    }
  });
}
