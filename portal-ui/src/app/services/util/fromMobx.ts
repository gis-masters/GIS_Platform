import { Observable } from 'rxjs';
import { computed } from 'mobx';

export function fromMobx<T>(expression: () => T, invokeImmediately: boolean = true) : Observable<T> {
  return new Observable(observer => {
    const computedValue = computed(expression);
    const disposer = computedValue.observe(changes => {
      observer.next(changes.newValue);
    }, invokeImmediately);

    return () => {
      disposer && disposer();
    }
  });
}
