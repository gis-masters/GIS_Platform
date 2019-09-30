import { HttpClient } from '@angular/common/http';

import { services } from '../../services/services';

interface Options {
  maxParallel?: number;
}

interface Task {
  method: 'get';
  url: string;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export class HttpQueue {
  private executing: number;
  private queue: Task[] = [];
  private maxParallel: number;

  constructor (options?: Options) {
    this.maxParallel = options && options.maxParallel || 4;
  }

  get <T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({method: 'get', url: url, resolve, reject})
      this.tick();
    });
  }

  private tick () {
    if (!this.queue.length || this.executing >= this.maxParallel) return;

    const task: Task = this.queue.shift();
    this.executing++;

    services.httpClient.get(task.url).subscribe((result) => {
      task.resolve(result);
      this.executing--;
      this.tick();
    });
  }
}
