export default function isIOS(): boolean {
  return (
    (/ipad|iphone|ipod/gi.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  );
}
