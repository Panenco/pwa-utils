export default function disableDoubletapZoom() {
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

  return () => {
    document.removeEventListener('touchend', handleTouchend);
  };
}
