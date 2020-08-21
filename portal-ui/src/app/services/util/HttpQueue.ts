import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

interface Task {
  method: 'get' | 'post' | 'delete' | 'patch';
  url: string;
  body?: any | null;
  options?: Options;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'text' | 'json' | 'blob';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpQueue {
  private executing: number;
  private queue: Task[] = [];
  private maxParallel = 6;

  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: Options): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({method: 'get', url, options, resolve, reject})
      this.tick();
    });
  }

  patch<T>(url: string, body: any, options?: Options): Promise<T> {
    return new Promise((resolve, reject) => {
      options = options || {};
      const headers = new HttpHeaders({ 'Content-type': 'application/merge-patch+json' });
      this.queue.push({ method: 'patch', url, body, options: { headers, ...options }, resolve, reject });
      this.tick();
    });
  }

  post<T>(url: string, body: any | null, options?: Options): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ method: 'post', url, body, options, resolve, reject });
      this.tick();
    });
  }

  delete<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ method: 'delete', url, resolve, reject });
      this.tick();
    });
  }

  private tick() {
    if (!this.queue.length || this.executing >= this.maxParallel) {
      return;
    }

    const task: Task = this.queue.shift();
    this.executing++;

    this.http.request(task.method, task.url, { body: task.body, ...task.options, withCredentials: true }).subscribe(
      result => {
        task.resolve(result);
        this.executing--;
        this.tick();
      },
      error => {
        task.reject(error);
        this.executing--;
        this.tick();
      }
    );
  }
}
