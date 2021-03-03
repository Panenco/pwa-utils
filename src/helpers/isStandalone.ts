export default function isStandalone(): boolean {
  // eslint-disable-next-line
  // @ts-ignore
  return window.navigator?.standalone || window?.matchMedia('(display-mode: standalone)')?.matches;
}
