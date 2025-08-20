import { action, makeObservable, observable } from 'mobx';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { PageableResources } from '../../../server-types/common-contracts';
import { communicationService } from '../communication.service';
import { PageQueryParams } from '../models';
import { Mime } from '../util/Mime';
import { CustomCache, CustomCacheConfig } from './CustomCache';
import { stringifyParams } from './http.utils';
import { replaceUrl } from './server-urls.service';

export const MAX_ITEMS_PER_PAGE = 300;

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
}

export interface ServerError {
  status: string;
  message: string;
  errors: unknown[];
}

interface RequestConfigWithCache extends RequestConfig {
  cache?: CustomCacheConfig;
  isAuthenticate?: boolean;
}

class Http {
  private static _instance: Http;
  static get instance(): Http {
    return this._instance || (this._instance = new this());
  }

  axios: AxiosInstance;
  cache: CustomCache<Promise<AxiosResponse>>;

  @observable waitingForAuth = false;

  private constructor() {
    this.cache = new CustomCache({ maxAge: 2 * 60 * 1000 });
    this.axios = axios.create();

    this.axios.defaults.withCredentials = true;
    this.axios.interceptors.request.use(config => {
      config.url = replaceUrl(config.url || '');

      return config;
    });

    makeObservable(this);
  }

  async get<T>(url: string, configWithCache: RequestConfigWithCache = {}): Promise<T> {
    const { cache: cacheConfig, ...config } = configWithCache;

    if (config.params) {
      config.params = stringifyParams(config.params);
    }

    const cacheKey = 'GET:' + this.axios.getUri({ url, ...config });
    const fromCache = this.cache.match(cacheKey, cacheConfig);
    let promise: Promise<AxiosResponse<T>>;

    if (fromCache) {
      promise = fromCache as Promise<AxiosResponse<T>>;
    } else {
      promise = this.axios.get(url, config);
      this.cache.add(cacheKey, promise, cacheConfig);
    }

    try {
      const response = await promise;

      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        await this.waitForAuth();

        return this.get<T>(url, configWithCache);
      }

      throw error;
    }
  }

  async getPaged<T>(url: string, config: RequestConfigWithCache = {}): Promise<T[]> {
    let result: T[] = [];
    let totalPages = 0;
    let page = 0;

    config.params = config.params || {};
    config.params.size = config.params.size || MAX_ITEMS_PER_PAGE;

    do {
      config.params.page = page;
      const response = await this.get<PageableResources<T>>(url, config);
      totalPages = response.page.totalPages;
      page = response.page.number + 1;

      result = [...result, ...response.content];
    } while (page < totalPages);

    return result;
  }

  async getPageWithObject<T>(
    url: string,
    pageParams: PageQueryParams,
    objectRecognizer: (o: T) => boolean,
    config: RequestConfigWithCache = {}
  ): Promise<[T[], number /* totalPages */, number /* pageNumber */] | undefined> {
    const optimisticConfig = { ...config, params: { ...config.params, ...pageParams } };
    // поначалу попытаемся найти объект на указанной странице
    const optimisticResponse = await this.get<PageableResources<T>>(url, optimisticConfig);
    const { number: pageNumber, totalElements, totalPages } = optimisticResponse.page;
    const optimisticPage = optimisticResponse.content || [];

    if (optimisticPage.some(objectRecognizer)) {
      return [optimisticPage, totalPages, pageNumber];
    }

    // не свезло, будем перебирать все объекты, пока не найдём или пока они не закончатся
    const scanPageParams = {
      ...pageParams,
      size: MAX_ITEMS_PER_PAGE
    };

    const scanTotalPages =
      Math.floor(totalElements / MAX_ITEMS_PER_PAGE) + (totalElements % MAX_ITEMS_PER_PAGE ? 1 : 0);

    let previousScanPage: T[] = [];

    for (let i = 0; i < scanTotalPages; i++) {
      scanPageParams.page = String(i);
      const scanResponse = await this.get<PageableResources<T>>(url, {
        ...config,
        params: { ...config.params, ...scanPageParams }
      });
      const currentScanPage = scanResponse.content || [];
      const foundIndex = currentScanPage.findIndex(objectRecognizer);

      if (foundIndex === -1) {
        previousScanPage = currentScanPage;

        continue;
      }

      // и так, нашли, теперь нужно вернуть содержащую объект страницу
      const globalFoundIndex = MAX_ITEMS_PER_PAGE * i + foundIndex;
      const positionOnPage = globalFoundIndex % Number(pageParams.size);
      const nextPage: T[] = [];
      if (MAX_ITEMS_PER_PAGE - foundIndex < Number(pageParams.size) - positionOnPage && i < scanTotalPages - 1) {
        scanPageParams.page = String(i + 1);
        const nextScanPageResponse = await this.get<PageableResources<T>>(url, {
          ...config,
          params: { ...config.params, ...scanPageParams }
        });
        const nextScanPage = nextScanPageResponse.content || [];
        nextPage.push(...nextScanPage);
      }
      const resultPage = [...previousScanPage, ...currentScanPage, ...nextPage].slice(
        previousScanPage.length + foundIndex - positionOnPage,
        previousScanPage.length + foundIndex - positionOnPage + Number(pageParams.size)
      );

      return [resultPage, totalPages, Math.floor(globalFoundIndex / Number(pageParams.size))];
    }
  }

  async post<T>(url: string, data?: unknown, configWithCache: RequestConfigWithCache = {}): Promise<T> {
    const { cache: requestCacheConfig = {}, isAuthenticate, ...config } = configWithCache;

    if (config.params) {
      config.params = stringifyParams(config.params);
    }

    const cacheConfig = { disabled: true, clear: true, ...requestCacheConfig };
    const cacheKey = 'POST:' + this.axios.getUri({ url, ...config }) + ' DATA:' + JSON.stringify(data);
    const fromCache = this.cache.match(cacheKey, cacheConfig);

    let promise: Promise<AxiosResponse<T>>;

    if (fromCache) {
      promise = fromCache as Promise<AxiosResponse<T>>;
    } else {
      promise = this.axios.post<T>(url, data, config);
      this.cache.add(cacheKey, promise, cacheConfig);
    }

    try {
      const response = await promise;

      return response.data;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 401 && isAuthenticate) {
        throw error;
      }

      if (err.response?.status === 401) {
        await this.waitForAuth();

        return this.post<T>(url, data, config);
      }

      throw error;
    }
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axios.put<T>(url, data, config);
    this.cache.clear();

    try {
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        await this.waitForAuth();

        return this.put<T>(url, data, config);
      }

      throw error;
    }
  }

  async patch<T>(url: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    const response = await this.axios.patch<T>(url, data, {
      ...config,
      headers: {
        'Content-Type': Mime.JSON_PATCH,
        ...config?.headers
      }
    });
    this.cache.clear();

    try {
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        await this.waitForAuth();

        return this.patch<T>(url, data, config);
      }

      throw error;
    }
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(url, config);
    this.cache.clear();

    try {
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        await this.waitForAuth();

        return this.delete<T>(url, config);
      }

      throw error;
    }
  }

  async waitForAuth(): Promise<boolean> {
    this.setWaitingForAuth(true);

    return new Promise(resolve => {
      communicationService.authDialogSuccess.once(() => {
        this.setWaitingForAuth(false);
        resolve(true);
      }, this);
    });
  }

  @action
  setWaitingForAuth(waiting: boolean) {
    this.waitingForAuth = waiting;
  }
}

export const http = Http.instance;

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { http, axios });
}
