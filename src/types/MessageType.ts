enum MessageType {
  SKIP_WAITING = 'sw/SKIP_WAITING',
  GET_VERSION = 'sw/GET_VERSION',
  GET_CHANGELOG = 'sw/GET_CHANGELOG',
  CLIENTS_CLAIM = 'sw/CLIENTS_CLAIM',

  EXEC_QUEUED_REQUESTS = 'sw/EXEC_QUEUED_REQUESTS',
  QUEUED_REQUEST_RESPONSE = 'sw/QUEUED_REQUEST_RESPONSE',
}

export default MessageType;
