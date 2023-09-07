interface BaseEvent {
  type: string;
  [key: string]: any; // Allows for additional properties
}

interface Listener {
  (event: any): void;
}

interface EventMap {
  [type: string]: Listener[];
}

function createEventDispatcher() {
  let _listeners: EventMap = {};

  function addEventListener(type: string, listener: Listener) {
    if (!_listeners[type]) {
      _listeners[type] = [];
    }

    if (!_listeners[type].includes(listener)) {
      _listeners[type].push(listener);
    }
  }

  function hasEventListener(type: string, listener: Listener): boolean {
    return _listeners[type]?.includes(listener) || false;
  }

  function removeEventListener(type: string, listener: Listener) {
    _listeners[type] = _listeners[type]?.filter((l) => l !== listener) || [];
  }

  function dispatchEvent(event: BaseEvent) {
    const listenerArray = _listeners[event.type]?.slice() || [];
    for (const listener of listenerArray) {
      listener(event);
    }
  }

  return {
    addEventListener,
    hasEventListener,
    removeEventListener,
    dispatchEvent,
  };
}

export { createEventDispatcher };
