/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1, no-underscore-dangle: 0 */

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { NetworkOnly, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

const defaultExpirationTime = {
  api: 24 * 60 * 60, // 24 hours
  googleFonts: 60 * 60 * 24 * 365, // 1 Year
  images: 30 * 24 * 60 * 60, // 30 Days
};

export function initServiceWorker({ CACHE_PREFIX, expiration = defaultExpirationTime }) {
  setCatchHandler(new NetworkOnly());

  /*
   * Static assets cache rules
   */

  precacheAndRoute(self.__WB_MANIFEST);

  registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new StaleWhileRevalidate({
      cacheName: `${CACHE_PREFIX}-google-fonts-stylesheets`,
    }),
  );

  registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new CacheFirst({
      cacheName: `${CACHE_PREFIX}-google-fonts-webfonts`,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds: expiration.googleFonts || defaultExpirationTime.googleFonts,
        }),
      ],
    }),
  );

  registerRoute(
    ({ url }) => {
      return url.host !== self.location.host && /\.(?:png|gif|jpg|jpeg|webp|svg)$/.test(url.pathname);
    },
    new CacheFirst({
      cacheName: `${CACHE_PREFIX}-images`,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200], // saving opaque responses as well
        }),
        new ExpirationPlugin({
          maxAgeSeconds: expiration.images || defaultExpirationTime.images,
        }),
      ],
    }),
  );

  /*
   * Serving of main entry point "/index.html" file for all requests.
   * This is made to be able to handle routing via js router and to be able opening app from any "route point".
   */

  const handler = createHandlerBoundToURL('/index.html');
  const navigationRoute = new NavigationRoute(handler);
  registerRoute(navigationRoute);

  /*
   * Service worker sent from page messages handling
   */

  if (process.env.DEBUG) {
    const handleMessage = (event) => {
      console.groupCollapsed('Service worker reveived an event message:');
      console.dir(event);
      console.groupEnd();
    };

    self.addEventListener('message', handleMessage);
  }

  /*
   * Handling errors of service worker environment
   */

  self.addEventListener('error', (e) => {
    if (process.env.DEBUG) {
      console.log(e.filename, e.lineno, e.colno, e.message);
    }
  });
}
