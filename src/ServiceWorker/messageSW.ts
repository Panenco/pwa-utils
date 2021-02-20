function messageSW(sw: ServiceWorker, data: any) {
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };
    sw.postMessage(data, [messageChannel.port2]);
  });
}

export default messageSW;
