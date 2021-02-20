import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

const matchCallback = ({ request, url }) => url.host !== self.location.host && request.destination === 'image';
const maxAgeSeconds = 30 * 24 * 60 * 60;
const maxEntries = 60;

const imagesCache = (options: { cachePrefix?: string; maxAgeSeconds?: number; maxEntries?: number }) => {
  registerRoute(
    matchCallback,
    new CacheFirst({
      cacheName: options.cachePrefix ? `${options.cachePrefix}images` : 'images',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200], // saving opaque responses as well
        }),
        new ExpirationPlugin({
          maxAgeSeconds: options.maxAgeSeconds ?? maxAgeSeconds,
          maxEntries: options.maxEntries ?? maxEntries,
        }),
      ],
    }),
  );
};
export default imagesCache;
