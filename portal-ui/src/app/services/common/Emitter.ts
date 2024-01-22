type Listener<T> = (e: CustomEvent<T>) => void;

interface Scoped<T = unknown> {
  channel: string;
  scope: unknown;
  listener: Listener<T>;
}

export class Emitter<T = unknown> {
  private static counter = 0;
  private static target = new EventTarget();
  private static scoped: Scoped[] = [];
  private readonly channel: string;

  constructor() {
    Emitter.counter++;
    this.channel = String(Emitter.counter);
  }

  static scopeOff<D = unknown>(scope: unknown, channel?: string, listeners?: Listener<D>[]): void {
    this.scoped = this.scoped.filter(item => {
      if (
        scope === item.scope &&
        (!channel || channel === item.channel) &&
        (!listeners || listeners.includes(item.listener))
      ) {
        Emitter.target.removeEventListener(item.channel, item.listener as EventListener);

        return false;
      }

      return true;
    });
  }

  emit(detail?: T): void {
    Emitter.target.dispatchEvent(new CustomEvent(this.channel, { detail }));
  }

  off(listener: Listener<T>, scope?: unknown): void {
    if (scope) {
      this.scopeOff(scope, [listener]);
    } else {
      Emitter.target.removeEventListener(this.channel, listener as EventListener);
    }
  }

  on(listener: Listener<T>, scope?: unknown): void {
    Emitter.target.addEventListener(this.channel, listener as EventListener);
    if (scope) {
      Emitter.scoped.push({ channel: this.channel, scope, listener: listener as EventListener });
    }
  }

  once(listener: Listener<T>, scope?: unknown): void {
    Emitter.target.addEventListener(this.channel, listener as EventListener, { once: true });
    if (scope) {
      Emitter.scoped.push({ channel: this.channel, scope, listener: listener as EventListener });
    }
  }

  scopeOff(scope: unknown, listeners?: Listener<T>[]): void {
    Emitter.scopeOff(scope, this.channel, listeners);
  }
}
