/**
 * Асинхронная функция с фиксированной сигнатурой аргументов (все элементы очереди однотипны).
 */
type AsyncFn<Args extends readonly unknown[], Result> = (...args: Args) => Promise<Result>;

/** Кортеж из функции и аргументов, соответствующих её сигнатуре. */
type QueuedAsyncCall<Args extends readonly unknown[], Result> = readonly [AsyncFn<Args, Result>, ...Args];

/**
 * Выполняет вызовы из очереди с ограничением числа одновременно выполняющихся задач.
 * Результаты возвращаются в том же порядке, что и элементы входного массива (как у Promise.all).
 * При ошибке в любой задаче промис отклоняется.
 */
export async function concurrentQueue<Args extends readonly unknown[], Result>(
  concurrency: number,
  items: readonly QueuedAsyncCall<Args, Result>[]
): Promise<Result[]> {
  if (items.length === 0) {
    return [];
  }

  if (!Number.isFinite(concurrency) || concurrency < 1) {
    throw new RangeError('concurrency: ожидается положительное конечное число');
  }

  const workerCount = Math.min(Math.floor(concurrency), items.length);
  const completed: { [index: number]: Result } = {};
  let nextIndex = 0;

  const runWorker = async (): Promise<void> => {
    let index = nextIndex;
    nextIndex += 1;

    while (index < items.length) {
      const entry = items[index];
      const [task, ...args] = entry;
      const value = await task(...args);
      completed[index] = value;
      index = nextIndex;
      nextIndex += 1;
    }
  };

  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));

  const output: Result[] = [];
  for (let i = 0; i < items.length; i += 1) {
    output.push(completed[i]);
  }

  return output;
}
