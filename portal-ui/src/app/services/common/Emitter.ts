import ee from 'event-emitter';

type Listener<T> = (data?: T) => void;

interface Scoped<T = unknown> {
  channel: string;
  scope: unknown;
  listener: Listener<T>;
}

export class Emitter<T = undefined> {
  private static counter = 0;
  private static ee = ee();
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
        Emitter.ee.off(item.channel, item.listener);

        return false;
      }

      return true;
    });
  }

  emit(data?: T): void {
    Emitter.ee.emit(this.channel, data);
  }

  off(listener: Listener<T>, scope?: unknown): void {
    if (scope) {
      this.scopeOff(scope, [listener]);
    } else {
      Emitter.ee.off(this.channel, listener);
    }
  }

  on(listener: Listener<T>, scope?: unknown): void {
    Emitter.ee.on(this.channel, listener);
    if (scope) {
      Emitter.scoped.push({ channel: this.channel, scope, listener });
    }
  }

  once(listener: Listener<T>, scope?: unknown): void {
    Emitter.ee.once(this.channel, listener);
    if (scope) {
      Emitter.scoped.push({ channel: this.channel, scope, listener });
    }
  }

  scopeOff(scope: unknown, listeners?: Listener<T>[]): void {
    Emitter.scopeOff(scope, this.channel, listeners);
  }
}
