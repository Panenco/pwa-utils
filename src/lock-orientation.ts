import * as React from 'react';

function deviceOrientation(): void {
  const { body } = document;

  body.classList.remove('lockOrientationRotate90deg');
  body.classList.remove('lockOrientationRotate-90deg');

  switch (window?.orientation || window.screen?.orientation?.angle) {
    case 90:
      body.classList.add('lockOrientationRotate-90deg');
      break;
    case -90:
      body.classList.add('lockOrientationRotate90deg');
      break;
    default:
      break;
  }
}

export const useLockOrientation = (): any => {
  React.useEffect(() => {
    const lockOrientation =
      window?.screen?.orientation?.lock ||
      // eslint-disable-next-line
      // @ts-ignore
      window?.screen?.lockOrientation ||
      (() => Promise.reject());

    let programmaticalyLocked = false;

    lockOrientation('portrait-primary')
      .then(() => {
        programmaticalyLocked = true;
      })
      .catch(() => {
        document.body.classList.add('lockOrientationEnabled');
        window.addEventListener('orientationchange', deviceOrientation);
        deviceOrientation();
      });

    return (): void => {
      if (!programmaticalyLocked) {
        document.body.classList.remove('lockOrientationEnabled');
        window.removeEventListener('orientationchange', deviceOrientation);
      }
    };
  }, []);
};
