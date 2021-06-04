import ServiceWorkerMessage from './ServiceWorkerMessage';

export default interface ServiceWorkerPlugin {
  handleMessage(message: ServiceWorkerMessage<any>): Promise<any>;
}
