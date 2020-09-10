export function onVisibilityChange(cb): () => void {
  let hidden;
  let visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden'; // Opera 12.10 and Firefox 18 and later support
    visibilityChange = 'visibilitychange';
    // eslint-disable-next-line
    // @ts-ignore
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
    // eslint-disable-next-line
    // @ts-ignore
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  const handleVisibilityChange = (): void => {
    if (!document[hidden]) {
      cb();
    }
  };

  document.addEventListener(visibilityChange, handleVisibilityChange);

  return (): void => {
    document.removeEventListener(visibilityChange, handleVisibilityChange);
  };
}

export function isIOS(): boolean {
  return (
    (/ipad|iphone|ipod/gi.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  );
}

export function isSafari(): boolean {
  return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
}

export function isStandalone(): boolean {
  // eslint-disable-next-line
  // @ts-ignore
  return window.navigator?.standalone || window?.matchMedia('(display-mode: standalone)')?.matches;
}
