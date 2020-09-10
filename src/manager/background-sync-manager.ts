import { useRef, useEffect } from 'react';
import { useNetworkStatus } from '../network-status';
import { EXEC_QUEUED_REQUESTS, QUEUED_REQUEST_RESPONSE } from '../service-worker/constants';

export function usePrevious<T = any>(value: T | undefined): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

type BgSyncManagerProps = {
  messageSW: (any) => Promise<any>;
  responseHandler: (any) => void;
};

const BgSyncManager: React.SFC<BgSyncManagerProps> = ({ messageSW, responseHandler }) => {
  const { online } = useNetworkStatus();
  const prevOnline = usePrevious(online);

  const replayRequests = () => {
    messageSW({
      type: EXEC_QUEUED_REQUESTS,
    });
  };

  function handleMessage(event) {
    switch (event?.data?.type) {
      case QUEUED_REQUEST_RESPONSE:
        responseHandler(event.data.payload);
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

export { BgSyncManager };
