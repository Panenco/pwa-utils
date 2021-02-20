import ServiceWorkerMessage from '../types/ServiceWorkerMessage';

export default interface ServiceWorkerPlugin {
  handleMessage(message: ServiceWorkerMessage<any>): Promise<any>;
}
