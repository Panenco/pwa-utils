import * as React from 'react';

export type NetworkStatusContext = {
  online: boolean;
  offline: boolean;
};

export const NetworkStatusContext = React.createContext<NetworkStatusContext>({
  online: true,
  offline: false,
});

export const useNetworkStatus = (): NetworkStatusContext => {
  return React.useContext(NetworkStatusContext);
};
