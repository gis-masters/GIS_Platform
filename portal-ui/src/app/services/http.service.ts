import axios, { AxiosRequestConfig } from 'axios';

import { replaceUrl } from './server-urls.service';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(async config => {
  config.url = await replaceUrl(config.url);

  return config;
});

class Http {
  private static _instance: Http;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const responce = await axios.get(url, config);

    return responce.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const responce = await axios.post(url, data, config);

    return responce.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const responce = await axios.patch(url, data, {
      ...config,
      headers: {
        'Content-Type': 'application/merge-patch+json',
        ...config?.headers
      }
    });

    return responce.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const responce = await axios.delete(url, config);

    return responce.data;
  }
}

export const http = Http.instance;
