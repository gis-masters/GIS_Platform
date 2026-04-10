import { describe, expect, test } from '@jest/globals';

import { concurrentQueue } from './concurrent-queue.util';

type QueueItem<Args extends readonly unknown[], R> = readonly [(...args: Args) => Promise<R>, ...Args];

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

describe('concurrentQueue', () => {
  test('возвращает пустой массив для пустой очереди', async () => {
    const empty: readonly QueueItem<readonly [], string>[] = [];
    await expect(concurrentQueue(3, empty)).resolves.toEqual([]);
  });

  test('отклоняет при невалидном concurrency и непустой очереди', async () => {
    const items: readonly QueueItem<readonly [], number>[] = [[() => Promise.resolve(1)]];
    await expect(concurrentQueue(0, items)).rejects.toThrow(RangeError);
    await expect(concurrentQueue(-1, items)).rejects.toThrow(RangeError);
    await expect(concurrentQueue(Number.NaN, items)).rejects.toThrow(RangeError);
    await expect(concurrentQueue(Number.POSITIVE_INFINITY, items)).rejects.toThrow(RangeError);
  });

  test('собирает результаты в порядке входного массива', async () => {
    const items: readonly QueueItem<readonly [], number>[] = [
      [
        async () => {
          await delay(30);

          return 1;
        }
      ],
      [
        async () => {
          await delay(5);

          return 2;
        }
      ],
      [
        async () => {
          await delay(15);

          return 3;
        }
      ]
    ];

    await expect(concurrentQueue(2, items)).resolves.toEqual([1, 2, 3]);
  });

  test('передаёт аргументы в функции', async () => {
    const items: readonly QueueItem<readonly [string, number], string>[] = [
      [
        async (a, b) => {
          await delay(5);

          return `${a}:${b}`;
        },
        'x',
        1
      ],
      [
        async (a, b) => {
          await delay(5);

          return `${a}:${b + 1}`;
        },
        'y',
        2
      ]
    ];

    await expect(concurrentQueue(2, items)).resolves.toEqual(['x:1', 'y:3']);
  });

  test('не держит одновременно больше n выполнений', async () => {
    let active = 0;
    let maxActive = 0;

    const items: readonly QueueItem<readonly [], number>[] = [1, 2, 3, 4, 5].map(
      (value): QueueItem<readonly [], number> => [
        async () => {
          active += 1;
          maxActive = Math.max(maxActive, active);
          await delay(20);
          active -= 1;

          return value;
        }
      ]
    );

    await concurrentQueue(2, items);
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  test('отклоняется при ошибке в одной из задач', async () => {
    const boom = new Error('fail');

    const items: readonly QueueItem<readonly [], number>[] = [
      [() => Promise.resolve(1)],
      [() => Promise.reject(boom)],
      [() => Promise.resolve(3)]
    ];

    await expect(concurrentQueue(2, items)).rejects.toBe(boom);
  });

  test('при concurrency больше числа задач запускается ровно столько воркеров, сколько задач', async () => {
    let started = 0;

    const items: readonly QueueItem<readonly [], number>[] = [
      [
        async () => {
          started += 1;
          await delay(5);

          return 1;
        }
      ],
      [
        async () => {
          started += 1;
          await delay(5);

          return 2;
        }
      ]
    ];

    const promise = concurrentQueue(10, items);
    await delay(0);
    expect(started).toBe(2);
    await expect(promise).resolves.toEqual([1, 2]);
  });
});
