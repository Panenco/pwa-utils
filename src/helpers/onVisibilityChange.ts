export default function onVisibilityChange(cb: () => void) {
  let hidden: string;
  let visibilityChange = '';

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
    if (!Object.hasOwnProperty.call(document, hidden)) {
      cb();
    }
  };

  // Fallback for non supporting browsers
  if (!visibilityChange) {
    document.addEventListener('focus', cb);

    return () => {
      document.removeEventListener('focus', cb);
    };
  }

  document.addEventListener(visibilityChange, handleVisibilityChange);

  return () => {
    document.removeEventListener(visibilityChange, handleVisibilityChange);
  };
}
