import { computed } from 'mobx';
import { Observable } from 'rxjs';

/**
 * Создаёт rxjs observable из MobX computed.
 *
 * Нужен только для старых компонентов angular. По возможности выпилить.
 *
 * @deprecated - legacy, do not use
 */
export function fromMobx<T>(expression: () => T, invokeImmediately = true): Observable<T> {
  return new Observable(observer => {
    const computedValue = computed<T>(expression);
    /* С новой версией mobx пришла ошибка в типах. Чинить смысла нет, надо выпиливать. */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const disposer = computedValue.observe_(changes => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      observer.next(changes.newValue as T);
    }, invokeImmediately);

    return () => {
      if (disposer) {
        disposer();
      }
    };
  });
}
