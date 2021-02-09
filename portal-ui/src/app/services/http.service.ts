import axios, { AxiosRequestConfig } from 'axios';
import { PageableResponse } from './models';

import { replaceUrl } from './server-urls.service';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(async config => {
  config.url = await replaceUrl(config.url);

  return config;
});

const ITEMS_PER_PAGE = 1000;

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

  async getPaged<T>(url: string, config: AxiosRequestConfig = {}): Promise<T[]> {
    let result = [];
    let totalPages = 0;
    let page = 0;

    config.params = config.params || {};
    config.params.size = config.params.size || ITEMS_PER_PAGE;

    do {
      config.params.page = page;
      const responce = await this.get<PageableResponse<{ [key: string]: T[] }>>(url, config);
      totalPages = responce.page.totalPages;
      page = responce.page.number + 1;
      let key = Object.keys(responce._embedded)[0];
      result = result.concat(responce._embedded[key]);
    } while (page < totalPages);

    return result;
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
