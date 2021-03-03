const { Modernizr } = window;

declare global {
  interface Window {
    Modernizr: any;
  }
}

export function doesDeviceHasBasicSupport(): boolean {
  return (
    Modernizr.flexbox &&
    Modernizr.flexwrap &&
    Modernizr.csscalc &&
    Modernizr.bgsizecover &&
    Modernizr.fetch &&
    Modernizr.history &&
    Modernizr.bloburls &&
    Modernizr.matchmedia &&
    Modernizr.localstorage
  );
}

export function doesDeviceSupportPWA(): boolean {
  return Modernizr.serviceworker && Modernizr.webworkers && Modernizr.postmessage;
}
