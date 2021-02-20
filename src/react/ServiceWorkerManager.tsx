import React, { ReactNode, Component } from 'react';
import { messageSW } from 'workbox-window/messageSW';
import { WorkboxLifecycleWaitingEvent, WorkboxLifecycleEvent } from 'workbox-window/utils/WorkboxEvent';
import { Workbox } from 'workbox-window/Workbox';
import { doesDeviceSupportPWA } from '../device-support';

import { onVisibilityChange } from '../helpers';
import { ServiceWorkerContext, ServiceWorkerContextType } from './ServiceWorkerContext';

import { BackgroundSyncManager } from './BackgroundSyncManager';
import { ChangelogEntry } from '../types/ChangelogEntry';
import MessageType from '../types/MessageType';

declare global {
  interface Window {
    ServiceWorkerManager: ServiceWorkerManager;
  }
}

type ServiceWorkerManagerProps = {
  children: ReactNode;
  scope: string;
  useCustomInstall: boolean;
  backgroundResponseHandler?: () => void;
};

type ServiceWorkerManagerState = {
  appInstallPrompt: Event | null;
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  version: string;
  changelog?: ChangelogEntry[];
  newVersion?: string;
};

export class ServiceWorkerManager extends Component<ServiceWorkerManagerProps, ServiceWorkerManagerState> {
  static defaultProps = {
    scope: '/',
    useCustomInstall: true,
  };

  workbox: Workbox;

  registration?: ServiceWorkerRegistration;

  clearListeners: () => void;

  constructor(props: ServiceWorkerManagerProps) {
    super(props);

    if (process.env.DEBUG) {
      window.ServiceWorkerManager = this;
    }

    // @ts-ignore
    this.workbox = new Proxy(
      {},
      {
        get() {
          console.warn(`Your Workbox instance wasn't created yet.`);
        },
      },
    );
    this.clearListeners = () => {};

    this.state = {
      isUpdateAvailable: false,
      isUpdating: false,
      version: '0.0.0',
      appInstallPrompt: null,
    };
  }

  componentDidMount() {
    this.interceptInstallPrompt();
    this.initServiceWorker();
  }

  componentWillUnmount() {
    this.clearListeners();
  }

  interceptInstallPrompt(): void {
    const { useCustomInstall } = this.props;
    if (useCustomInstall) {
      window.addEventListener('beforeinstallprompt', (event: Event) => {
        event.preventDefault(); // Prevent the mini-infobar from appearing on mobile
        this.setState({ appInstallPrompt: event });
      });
    }
  }

  checkForUpdate = async () => {
    if (!this.registration || !this.workbox) return;

    if (process.env.DEBUG) {
      console.log('Checking for update...');
    }

    try {
      await this.workbox.update();
    } catch (error) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(registrations.map((registration) => registration.unregister()));
      window.location.reload();
    }

    if (this.registration?.waiting) {
      const { version: currentVersion } = this.state;
      const nextVersion = await this.getServiceWorkerVersion(this.registration.waiting);

      if (currentVersion !== nextVersion) {
        this.setState({
          newVersion: nextVersion,
          isUpdateAvailable: true,
        });
      }
    }
  };

  getServiceWorkerVersion = async (serviceWorker?: ServiceWorker): Promise<string> => {
    const v = await messageSW(serviceWorker ?? (await this.workbox.active), { type: MessageType.GET_VERSION });
    return v;
  };

  getServiceWorkerChangelog = async (serviceWorker?: ServiceWorker): Promise<ChangelogEntry[]> => {
    const changelog = await messageSW(serviceWorker ?? (await this.workbox.active), {
      type: MessageType.GET_CHANGELOG,
    });
    return changelog;
  };

  onServiceWorkerWaiting = async (event: WorkboxLifecycleWaitingEvent) => {
    if (process.env.DEBUG) {
      console.group('Service Worker waiting event:');
      console.dir(event);
      console.groupEnd();
    }

    const { version: currentVersion } = this.state;
    const newVersion = await this.getServiceWorkerVersion(event.sw!);
    const changelog = await this.getServiceWorkerChangelog(event.sw!);

    if (currentVersion !== newVersion) {
      this.setState({
        newVersion,
        isUpdateAvailable: true,
        changelog,
      });
    }
  };

  onServiceWorkerControlling = () => {
    window.location.reload();
  };

  onServiceWorkerActivated = (event: WorkboxLifecycleEvent) => {
    if (event.sw) {
      messageSW(event.sw, { type: MessageType.CLIENTS_CLAIM });
    }

    window.location.reload();
  };

  update = () => {
    if (this.registration?.waiting) {
      messageSW(this.registration.waiting, { type: MessageType.SKIP_WAITING });
      setTimeout(() => window.location.reload(), 3000); // Fallback
    }

    const { isUpdating } = this.state;
    if (isUpdating) return;

    this.setState({
      isUpdating: true,
    });
  };

  async initServiceWorker(): Promise<void> {
    if ((process.env.NODE_ENV === 'production' || process.env.DEBUG) && 'serviceWorker' in navigator) {
      const { scope } = this.props;

      this.workbox = new Workbox('/service-worker.js', { scope });
      this.workbox.addEventListener('waiting', this.onServiceWorkerWaiting);
      this.workbox.addEventListener('controlling', this.onServiceWorkerControlling);
      this.workbox.addEventListener('activated', this.onServiceWorkerActivated);
      this.registration = await this.workbox.register();

      if (process.env.DEBUG) {
        console.group('Service Worker was registered');
        console.dir(this.registration);
        console.groupEnd();
      }

      const version = await this.getServiceWorkerVersion();

      this.setState({
        version,
      });

      const removeVisibilityChangeListener = onVisibilityChange(this.checkForUpdate);

      this.clearListeners = () => {
        removeVisibilityChangeListener();
      };
    }
  }

  render() {
    const { children, backgroundResponseHandler } = this.props;
    const {
      update,
      checkForUpdate,
      state: { isUpdateAvailable, appInstallPrompt, isUpdating, version, changelog },
    } = this;

    const contextValue: ServiceWorkerContextType = {
      isUpdateAvailable,
      isUpdating,
      appInstallPrompt,
      update,
      checkForUpdate,
      version,
      changelog,
    };

    return (
      <ServiceWorkerContext.Provider value={contextValue}>
        {doesDeviceSupportPWA() && backgroundResponseHandler && (
          <BackgroundSyncManager responseHandler={backgroundResponseHandler} messageSW={this.workbox.messageSW} />
        )}
        {children}
      </ServiceWorkerContext.Provider>
    );
  }
}
