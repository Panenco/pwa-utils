import * as React from 'react';
import { NetworkStatusContext } from './context';

export type NetworkStatusProviderProps = {
  children: React.ReactNode;
};

const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({ children }: NetworkStatusProviderProps) => {
  const [isOnline, setIsOnline] = React.useState(window.navigator.onLine);

  const setOnline = (): void => setIsOnline(true);
  const setOffline = (): void => setIsOnline(false);

  React.useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return (): void => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return React.createElement(
    NetworkStatusContext.Provider,
    {
      value: {
        online: isOnline,
        offline: !isOnline,
      },
    },
    children,
  );
};

export const NetworkStatus = {
  Provider: NetworkStatusProvider,
  Context: NetworkStatusContext,
};
