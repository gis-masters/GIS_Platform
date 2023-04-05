import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { CustomCache, CustomCacheConfig } from './CustomCache';
import { communicationService } from '../communication.service';
import { PageableResponse, PageQueryParams } from '../models';
import { replaceUrl } from './server-urls.service';
import { Mime } from '../util/Mime';

import { getPayloadFromPageableResponse, stringifyParams } from './http.utils';
import { PageableResources } from '../../../server-types/common-contracts';
import { action, makeObservable, observable } from 'mobx';

const ITEMS_PER_PAGE = 300;

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, string | number>;
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
  axios: AxiosInstance;
  cache: CustomCache<Promise<AxiosResponse>>;
  @observable waitingForAuth = false;

  private static _instance: Http;

  static get instance(): Http {
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

  async getPagedOld<T>(url: string, config: RequestConfigWithCache = {}): Promise<T[]> {
    let result: T[] = [];
    let totalPages = 0;
    let page = 0;

    config.params = config.params || {};
    config.params.size = config.params.size || ITEMS_PER_PAGE;

    do {
      config.params.page = page;
      const response = await this.get<PageableResponse<T>>(url, config);
      totalPages = response.page.totalPages;
      page = response.page.number + 1;

      if (response._embedded) {
        result = [...result, ...getPayloadFromPageableResponse(response, true)];
      }
    } while (page < totalPages);

    return result;
  }

  async getPaged<T>(url: string, config: RequestConfigWithCache = {}): Promise<T[]> {
    let result: T[] = [];
    let totalPages = 0;
    let page = 0;

    config.params = config.params || {};
    config.params.size = config.params.size || ITEMS_PER_PAGE;

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
    config: RequestConfigWithCache = {},
    withOldPageableResponse: boolean
  ): Promise<[T[], number /* totalPages */, number /* pageNumber */]> | undefined {
    const optimisticConfig = { ...config, params: { ...config.params, ...pageParams } };
    // поначалу попытаемся найти объект на указанной странице
    const optimisticResponse = withOldPageableResponse
      ? await this.get<PageableResponse<T>>(url, optimisticConfig)
      : await this.get<PageableResources<T>>(url, optimisticConfig);
    const { number: pageNumber, totalElements, totalPages } = optimisticResponse.page;
    const optimisticPage = getPayloadFromPageableResponse(optimisticResponse, withOldPageableResponse);

    if (optimisticPage.some(objectRecognizer)) {
      return [optimisticPage, totalPages, pageNumber];
    }

    // не свезло, будем перебирать все объекты, пока не найдём или пока они не закончатся
    const scanPageParams = {
      ...pageParams,
      size: ITEMS_PER_PAGE
    };

    const scanTotalPages = Math.floor(totalElements / ITEMS_PER_PAGE) + (totalElements % ITEMS_PER_PAGE ? 1 : 0);

    let previousScanPage: T[] = [];

    for (let i = 0; i < scanTotalPages; i++) {
      scanPageParams.page = String(i);
      const scanResponse = await this.get<PageableResponse<T>>(url, {
        ...config,
        params: { ...config.params, ...scanPageParams }
      });
      const currentScanPage = getPayloadFromPageableResponse(scanResponse, withOldPageableResponse);
      const foundIndex = currentScanPage.findIndex(objectRecognizer);

      if (foundIndex === -1) {
        previousScanPage = currentScanPage;

        continue;
      }

      // и так, нашли, теперь нужно вернуть содержащую объект страницу
      const globalFoundIndex = ITEMS_PER_PAGE * i + foundIndex;
      const positionOnPage = globalFoundIndex % Number(pageParams.size);
      const nextPage: T[] = [];
      if (ITEMS_PER_PAGE - foundIndex < Number(pageParams.size) - positionOnPage && i < scanTotalPages - 1) {
        scanPageParams.page = String(i + 1);
        const nextScanPageResponse = await this.get<PageableResponse<T>>(url, {
          ...config,
          params: { ...config.params, ...scanPageParams }
        });
        nextPage.push(...getPayloadFromPageableResponse(nextScanPageResponse, withOldPageableResponse));
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
    const fromCache = this.cache.match(cacheKey, { disabled: true, clear: true, ...cacheConfig });
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
