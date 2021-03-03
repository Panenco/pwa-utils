import MessageType from './MessageType';

export default interface ServiceWorkerMessage<T> {
  type: MessageType;
  payload?: T;
}
