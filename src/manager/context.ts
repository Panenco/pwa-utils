import * as React from 'react';

export type ChangelogEntry = {
  description: string;
  version: string;
  date: number;
};

export type ServiceWorkerContext = {
  isUpdateAvaliable: boolean;
  isUpdating: boolean;
  appInstallPrompt: Event;
  handleUpdateAccept: () => void;
  manualUpdate: () => void;
  version: string;
  changelog?: ChangelogEntry[];
};

export const ServiceWorkerContext = React.createContext<ServiceWorkerContext>({
  isUpdateAvaliable: false,
  isUpdating: false,
  appInstallPrompt: new Event('null'),
  handleUpdateAccept: () => {},
  manualUpdate: () => {},
  version: '0.0.0',
  changelog: [],
});

export const useServiceWorkerContext = (): ServiceWorkerContext => React.useContext(ServiceWorkerContext);
