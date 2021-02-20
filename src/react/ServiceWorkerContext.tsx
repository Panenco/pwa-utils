import { createContext, useContext } from 'react';
import { ChangelogEntry } from '../types/ChangelogEntry';

export type ServiceWorkerContextType = {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  appInstallPrompt: Event | null;
  update: () => void;
  checkForUpdate: () => void;
  version: string;
  changelog?: ChangelogEntry[];
};

export const ServiceWorkerContext = createContext<ServiceWorkerContextType>({
  isUpdateAvailable: false,
  isUpdating: false,
  appInstallPrompt: new Event('null'),
  update: () => {},
  checkForUpdate: () => {},
  version: '0.0.0',
  changelog: [],
});

export const useServiceWorkerContext = (): ServiceWorkerContextType => useContext(ServiceWorkerContext);
