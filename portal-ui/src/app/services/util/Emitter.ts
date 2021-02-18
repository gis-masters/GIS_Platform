import ee from 'event-emitter';

type Listener<T = any> = (data?: T) => void;

interface Scoped {
  channel: string;
  scope: any;
  listener: Listener;
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

  static scopeOff(scope: any, channel?: string, listeners?: Listener[]) {
    this.scoped = this.scoped.filter(item => {
      if (
        scope === item.scope &&
        (!channel || channel === item.channel) &&
        (!listeners || listeners.includes(item.listener))
      ) {
        Emitter.ee.off(item.channel, item.listener);
        return false;
      } else {
        return true;
      }
    });
  }

  emit(data?: T) {
    Emitter.ee.emit(this.channel, data);
  }

  off(listener: Listener<T>, scope?: any) {
    if (scope) {
      this.scopeOff(scope, [listener]);
    } else {
      Emitter.ee.off(this.channel, listener);
    }
  }

  on(listener: Listener, scope?: any) {
    Emitter.ee.on(this.channel, listener);
    if (scope) {
      Emitter.scoped.push({ channel: this.channel, scope, listener });
    }
  }

  once(listener: Listener, scope?: any) {
    Emitter.ee.once(this.channel, listener);
    if (scope) {
      Emitter.scoped.push({ channel: this.channel, scope, listener });
    }
  }

  scopeOff(scope: any, listeners?: Listener[]) {
    Emitter.scopeOff(scope, this.channel, listeners);
  }
}
