/// <reference path='../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import fs from 'fs';
import path from 'path';
import MockAdapter from 'axios-mock-adapter';

declare const AxiosMockAdapter: typeof MockAdapter;
declare const mock: MockAdapter;
declare const window: { AxiosMockAdapter: typeof MockAdapter; mock: MockAdapter };
declare const http: { axios: AxiosInstance };

const mockAdapterPath = path.join(__dirname, '../../../node_modules/axios-mock-adapter/dist/axios-mock-adapter.min.js');
let mockAdapterCode = '';

async function initMockAdapter(browser: WebdriverIO.Browser) {
  const mockAdapterAlreadyLoaded = await browser.execute(() => {
    return Boolean(window.AxiosMockAdapter);
  });

  if (mockAdapterAlreadyLoaded) {
    return;
  }

  if (!mockAdapterCode) {
    await new Promise<void>((resolve, reject) => {
      fs.readFile(mockAdapterPath, { encoding: 'utf-8' }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          mockAdapterCode = data;
          resolve();
        }
      });
    });
  }

  await browser.execute(mockAdapterCode => {
    if (!window.AxiosMockAdapter) {
      const scriptElm = document.createElement('script');
      scriptElm.appendChild(document.createTextNode(mockAdapterCode));
      document.body.appendChild(scriptElm);

      window.mock = new AxiosMockAdapter(http.axios, { delayResponse: 300, onNoMatch: 'throwException' });
    }
  }, mockAdapterCode);
}

export async function mockApi(
  browser: WebdriverIO.Browser,
  {
    method,
    url,
    params,
    status,
    response
  }: {
    method: Method;
    url: RegExp;
    params?: Record<string, string>;
    status: number;
    response: unknown;
  }
) {
  await initMockAdapter(browser);

  browser.execute(
    (method, urlRexExpSource, params, status, response) => {
      switch (method.toLocaleLowerCase()) {
        case 'get':
          if (params) {
            mock.onGet(new RegExp(urlRexExpSource), { params }).reply(status, response);
          } else {
            mock.onGet(new RegExp(urlRexExpSource)).reply(status, response);
          }
          break;
        case 'post':
          if (params) {
            mock.onPost(new RegExp(urlRexExpSource), { params }).reply(status, response);
          } else {
            mock.onPost(new RegExp(urlRexExpSource)).reply(status, response);
          }
          break;
      }
    },
    method,
    url.source,
    params,
    status,
    response
  );
}

export async function getHistory(browser: WebdriverIO.Browser): Promise<{ [method: string]: AxiosRequestConfig[] }> {
  return browser.execute(() => {
    return mock.history;
  });
}
