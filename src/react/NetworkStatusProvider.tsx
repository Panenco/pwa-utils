import React from 'react';
import { NetworkStatusContext, NetworkStatusContextType } from './NetworkStatusContext';

export type NetworkStatusProviderProps = {
  children: React.ReactNode;
};

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = React.useState(window.navigator.onLine);

  const setOnline = () => setIsOnline(true);
  const setOffline = () => setIsOnline(false);

  React.useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  const contextValue: NetworkStatusContextType = {
    online: isOnline,
    offline: !isOnline,
  };

  return <NetworkStatusContext.Provider value={contextValue}>{children}</NetworkStatusContext.Provider>;
};
