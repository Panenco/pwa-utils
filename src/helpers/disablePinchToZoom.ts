export default function disablePinchToZoom(): () => void {
  const handleTouchmove = (event) => {
    // Say hi Apple
    if (!!event.scale && event.scale !== 1) {
      event.preventDefault();
    }
  };
  document.addEventListener('touchmove', handleTouchmove, { passive: false });

  return () => {
    document.removeEventListener('touchmove', handleTouchmove);
  };
}
