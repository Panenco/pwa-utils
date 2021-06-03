import MessageType from '../types/MessageType';
import { useRef, useEffect } from 'react';
import { QueuedRequestResponseMessage } from '../ServiceWorker';
import ServiceWorkerMessage from '../types/ServiceWorkerMessage';
import { useNetworkStatus } from './NetworkStatusContext';

export function usePrevious<T = any>(value: T | undefined): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export interface BackgroundSyncManagerProps {
  messageSW: (data: {}) => Promise<any>;
  responseHandler: (payload: QueuedRequestResponseMessage['payload']) => void;
}

export const BackgroundSyncManager: React.FC<BackgroundSyncManagerProps> = ({ messageSW, responseHandler }) => {
  const { online } = useNetworkStatus();
  const prevOnline = usePrevious(online);

  const replayRequests = () => {
    const message: ServiceWorkerMessage<undefined> = {
      type: MessageType.EXEC_QUEUED_REQUESTS,
    };

    messageSW(message);
  };

  function handleMessage(event: ExtendableMessageEvent) {
    const message = event.data as QueuedRequestResponseMessage;
    switch (message.type) {
      case MessageType.QUEUED_REQUEST_RESPONSE:
        responseHandler(message.payload);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (prevOnline !== undefined && !prevOnline && online) {
      replayRequests();
    }
  }, [online, prevOnline]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  });

  return null;
};
