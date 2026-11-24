// A deliberately small signals implementation, the same idea the article builds up.

type Subscriber = { run: () => void; deps: Set<Set<Subscriber>> };
let active: Subscriber | null = null;

function track(subscribers: Set<Subscriber>) {
  if (!active) return;
  subscribers.add(active);
  active.deps.add(subscribers);
}

function runTracked(subscriber: Subscriber, fn: () => void) {
  subscriber.deps.forEach((set) => set.delete(subscriber));
  subscriber.deps.clear();
  const previous = active;
  active = subscriber;
  try {
    fn();
  } finally {
    active = previous;
  }
}

export function signal<T>(value: T) {
  const subscribers = new Set<Subscriber>();
  return {
    get: () => {
      track(subscribers);
      return value;
    },
    set: (next: T) => {
      if (Object.is(next, value)) return;
      value = next;
      [...subscribers].forEach((s) => s.run());
    },
  };
}

export function computed<T>(fn: () => T) {
  const subscribers = new Set<Subscriber>();
  let value: T;
  let dirty = true;
  const self: Subscriber = {
    deps: new Set(),
    run: () => {
      if (dirty) return;
      dirty = true;
      [...subscribers].forEach((s) => s.run());
    },
  };
  return {
    get: () => {
      track(subscribers);
      if (dirty) {
        runTracked(self, () => {
          value = fn();
        });
        dirty = false;
      }
      return value;
    },
  };
}

export function effect(fn: () => void) {
  const self: Subscriber = { deps: new Set(), run: () => runTracked(self, fn) };
  self.run();
}
