import { createContext, useContext } from 'react';

export type NetworkStatusContextType = {
  online: boolean;
  offline: boolean;
};

export const NetworkStatusContext = createContext<NetworkStatusContextType>({
  online: true,
  offline: false,
});

export const useNetworkStatus = (): NetworkStatusContextType => {
  return useContext(NetworkStatusContext);
};
