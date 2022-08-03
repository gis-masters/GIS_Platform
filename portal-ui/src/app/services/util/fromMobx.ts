import { Observable } from 'rxjs';
import { computed } from 'mobx';

export function fromMobx<T>(expression: () => T, invokeImmediately = true): Observable<T> {
  return new Observable(observer => {
    const computedValue = computed<T>(expression);
    const disposer = computedValue.observe_(changes => {
      observer.next(changes.newValue);
    }, invokeImmediately);

    return () => {
      if (disposer) {
        disposer();
      }
    };
  });
}
