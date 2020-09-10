import { useEffect } from 'react';

export function disablePinchToZoom(): () => void {
  const handleTouchmove = (event) => {
    // Say hi Apple
    if (!!event.scale && event.scale !== 1) {
      event.preventDefault();
    }
  };
  document.addEventListener('touchmove', handleTouchmove, { passive: false });

  return (): void => {
    document.removeEventListener('touchmove', handleTouchmove);
  };
}

export function disableDoubletapZoom(): () => void {
  let lastTouchEnd: any = null;

  const handleTouchend = (event) => {
    const timestamp = new Date();

    if (lastTouchEnd) {
      if (timestamp.getTime() - lastTouchEnd <= 300) {
        event.preventDefault();
      }
    }

    lastTouchEnd = timestamp;
  };

  document.addEventListener('touchend', handleTouchend, { passive: false });

  return (): void => {
    document.removeEventListener('touchend', handleTouchend);
  };
}

export const useZoomDisabler = () => {
  useEffect(disablePinchToZoom, []);
  useEffect(disableDoubletapZoom, []);
};
