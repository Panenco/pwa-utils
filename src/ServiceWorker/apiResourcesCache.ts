import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { WorkboxPlugin } from 'workbox-core/types';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

export default function apiResourcesCache(
  baseURL: string,
  options: {
    cachePrefix?: string;
    expirationMaxAgeSeconds: number;
    plugins?: WorkboxPlugin[];
  },
) {
  const apiRegExp = new RegExp(`^${baseURL}`);

  registerRoute(
    apiRegExp,
    new StaleWhileRevalidate({
      cacheName: options.cachePrefix ? `${options.cachePrefix}api` : 'api',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds: options.expirationMaxAgeSeconds ?? 24 * 60 * 60,
        }),
        ...(options.plugins ?? []),
      ],
    }),
  );
}
