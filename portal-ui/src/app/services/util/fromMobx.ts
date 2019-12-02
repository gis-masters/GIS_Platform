import { Observable } from 'rxjs';
import { computed } from 'mobx';

export function fromMobx<T>( mobxObservable: T ) : Observable<T> {
  return new Observable(observer => {
    const computedValue = computed(() => mobxObservable);
    const disposer = computedValue.observe(changes => {
      observer.next(changes.newValue);
    }, true);

    return () => {
      disposer && disposer();
    }
  });
}
