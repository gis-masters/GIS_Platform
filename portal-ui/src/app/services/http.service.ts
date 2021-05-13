import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { CustomCache, CustomCacheConfig } from './util/CustomCache';
import { replaceUrl } from './server-urls.service';
import { PageableResponse } from './models';

const ITEMS_PER_PAGE = 1000;

interface RequestConfigWithCache extends AxiosRequestConfig {
  cache?: CustomCacheConfig;
}

class Http {
  axios: AxiosInstance;
  cache: CustomCache<Promise<AxiosResponse>>;

  private static _instance: Http;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.cache = new CustomCache({ maxAge: 2 * 60 * 1000 });
    this.axios = axios.create();

    this.axios.defaults.withCredentials = true;

    this.axios.interceptors.request.use(async config => {
      config.url = await replaceUrl(config.url);

      return config;
    });
  }

  async get<T>(url: string, configWithCache: RequestConfigWithCache = {}): Promise<T> {
    const { cache: cacheConfig, ...config } = configWithCache;
    const resultUri = this.axios.getUri({ url, ...config });
    const fromCache = this.cache.match(resultUri);
    let promise: Promise<AxiosResponse<T>>;

    if (fromCache) {
      promise = fromCache;
    } else {
      promise = this.axios.get(url, config);
      this.cache.add(resultUri, promise, cacheConfig);
    }

    const response = await promise;

    return response.data;
  }

  async getPaged<T>(url: string, config: RequestConfigWithCache = {}): Promise<T[]> {
    let result = [];
    let totalPages = 0;
    let page = 0;

    config.params = config.params || {};
    config.params.size = config.params.size || ITEMS_PER_PAGE;

    do {
      config.params.page = page;
      const response = await this.get<PageableResponse<{ [key: string]: T[] }>>(url, config);
      totalPages = response.page.totalPages;
      page = response.page.number + 1;

      if (response._embedded) {
        const key = Object.keys(response._embedded)[0];
        result = result.concat(response._embedded[key]);
      }
    } while (page < totalPages);

    return result;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.post(url, data, config);
    this.cache.clear();

    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.put(url, data, config);
    this.cache.clear();

    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.patch(url, data, {
      ...config,
      headers: {
        'Content-Type': 'application/merge-patch+json',
        ...config?.headers
      }
    });
    this.cache.clear();

    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete(url, config);
    this.cache.clear();

    return response.data;
  }
}

export const http = Http.instance;
