export class BatchModel<T> {

  batches: T[][] = [];
  totalBatches: number;
  percentOfOneBatch: number;

  private BATCH_SIZE = 200;

  constructor (objects: T[]) {
    this.totalBatches = Math.ceil(objects.length / this.BATCH_SIZE);
    this.percentOfOneBatch = 100 / this.totalBatches;
    this.batches = this.splitListToParts(objects, this.totalBatches);
  }

  public splitListToParts(arr, n): T[][] {
    const plen = Math.ceil(arr.length / n);

    return arr.reduce(function (p, c, i, a) {
      if (i % plen === 0) {
        p.push([]);
      }

      p[p.length - 1][i] = c;

      return p;
    }, []);
  }
}
