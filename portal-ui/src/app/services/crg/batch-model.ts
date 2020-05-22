import { chunk } from 'lodash';

export class BatchModel<T> {
  batches: T[][] = [];
  totalBatches: number;
  percentOfOneBatch: number;

  private BATCH_SIZE = 200;

  constructor (objects: T[]) {
    this.batches = chunk(objects, this.BATCH_SIZE);
    this.totalBatches = this.batches.length;
    this.percentOfOneBatch = 100 / this.totalBatches;
  }
}
